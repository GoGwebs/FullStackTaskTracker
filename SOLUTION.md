# FullStack Task Tracker — Solution Overview

## Table of Contents

##### ctrl + click to follow link (e.g. ctrl + click on #introduction)

1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Backend — TaskTrackerWebAPI](#backend--tasktrackerwebapi)
   - [Project Configuration](#project-configuration)
   - [Application Startup & Dependency Injection](#application-startup--dependency-injection)
   - [Endpoint Registration Pattern](#endpoint-registration-pattern)
   - [Data Layer](#data-layer)
   - [Feature Endpoints (CRUD)](#feature-endpoints-crud)
   - [DTOs & Mapper](#dtos--mapper)
   - [Infrastructure & Persistence](#infrastructure--persistence)
   - [Validation](#validation)
   - [Error Handling](#error-handling)
   - [CORS Configuration](#cors-configuration)
   - [Containerization](#containerization)
5. [Frontend — TaskTrackerFrontend](#frontend--tasktrackerFrontend)
   - [Project Setup](#project-setup)
   - [Application Bootstrap](#application-bootstrap)
   - [Routing](#routing)
   - [State Management with Signals](#state-management-with-signals)
   - [Models & DTOs](#models--dtos)
   - [Components](#components)
   - [Form Handling & Validation](#form-handling--validation)
   - [Server-Side Error Mapping](#server-side-error-mapping)
6. [Integration Tests](#integration-tests)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [API Specification](#api-specification)
9. [How to Run](#how-to-run)
10. [Summary of Design Decisions](#summary-of-design-decisions)

---

## Introduction

**FullStack Task Tracker** is a full-stack web application for managing tasks. It provides a complete CRUD (Create, Read, Update, Delete) workflow with search and sorting capabilities. The solution is composed of three projects:

| Project | Role |
|---------|------|
| **TaskTrackerWebAPI** | .NET 8 Minimal API backend |
| **TaskTrackerFrontend** | Angular 21 single-page application |
| **TaskTracker.IntegrationTests** | xUnit integration test suite |

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| .NET | 8.0 | Runtime and SDK |
| ASP.NET Core Minimal API | 8.0 | HTTP API framework (no controllers) |
| Entity Framework Core | 8.0.25 | ORM / data access |
| EF Core InMemory Provider | 8.0.25 | In-memory database for development |
| FluentValidation | 8.3.0 | Request validation |
| Swashbuckle (Swagger) | 6.6.2 | API documentation (OpenAPI) |
| Docker | — | Containerization |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 21.2.4 | SPA framework |
| TypeScript | 5.9.2 | Type-safe JavaScript |
| Bootstrap | 5.3.8 | UI styling (SCSS) |
| ng-bootstrap | 20.0.0 | Angular-native Bootstrap widgets |
| RxJS | 7.8.0 | Reactive programming (observables) |
| Vitest | 4.0.8 | Unit test runner |
| Prettier | — | Code formatting |

### Testing & DevOps

| Technology | Purpose |
|------------|---------|
| xUnit 2.5.3 | Test framework |
| Microsoft.AspNetCore.Mvc.Testing | In-process integration test host |
| Coverlet | Code coverage |
| GitHub Actions | Continuous integration |

---

## Architecture Overview

```
┌────────────────────────────────┐
│     Angular 21 Frontend        │
│  (Standalone Components,       │
│   Signals, Reactive Forms)     │
│         Port 4200              │
└──────────┬─────────────────────┘
           │  HTTP (REST/JSON)
           ▼
┌────────────────────────────────┐
│   .NET 8 Minimal API Backend   │
│  (Vertical Slice Architecture, │
│   FluentValidation, EF Core)   │
│         Port 5293              │
└──────────┬─────────────────────┘
           │
           ▼
┌────────────────────────────────┐
│   EF Core InMemory Database    │
│     (Seeded on startup)        │
└────────────────────────────────┘
```

**Key Architectural Patterns:**

- **Vertical Slice Architecture (Backend)** — Code is organized by feature (`Features/Tasks/`) rather than by technical concern. Each feature contains its own endpoints, DTOs, and mappers.
- **Minimal API (Backend)** — Uses ASP.NET Core Minimal APIs instead of traditional MVC controllers, resulting in less ceremony and a more functional style.
- **Static Abstract Interface Pattern (Backend)** — Endpoint registration uses C# 11 static abstract interface members for a clean, type-safe plugin pattern.
- **Standalone Components (Frontend)** — All Angular components are standalone (no `NgModule` declarations), following Angular's modern recommended approach.
- **Signal-Based State Management (Frontend)** — Uses Angular's built-in `signal()` and `computed()` primitives for reactive state instead of external state management libraries.
- **Repository Pattern (Backend)** — Data access is abstracted behind `ITaskRepo`, allowing the implementation to be swapped without changing business logic.

---

## Backend — TaskTrackerWebAPI

### Project Configuration

The backend targets **.NET 8.0** with nullable reference types enabled and implicit usings. NuGet package lock files are used for reproducible builds.

**NuGet Dependencies:**

- `FluentValidation` + `FluentValidation.DependencyInjectionExtensions` — Declarative request validation
- `Microsoft.EntityFrameworkCore` + `Microsoft.EntityFrameworkCore.InMemory` — ORM with in-memory provider
- `Microsoft.AspNetCore.OpenApi` + `Swashbuckle.AspNetCore` — Swagger/OpenAPI documentation
- `Microsoft.VisualStudio.Azure.Containers.Tools.Targets` — Docker tooling for Visual Studio

---

### Application Startup & Dependency Injection

The `Program.cs` file serves as the **composition root**. All services are registered and middleware is configured here:

```
Service Registration:
  ├─ FluentValidation (auto-discovered from assembly)
  ├─ Global Exception Handler
  ├─ ProblemDetails (RFC 7807)
  ├─ HTTP Logging
  ├─ CORS Policy ("AllowFrontend")
  ├─ Swagger / OpenAPI (development only)
  ├─ EF Core InMemory DbContext
  └─ ITaskRepo → TaskRepo (Scoped)

Middleware Pipeline:
  ├─ Exception Handler
  ├─ HTTP Logging
  ├─ CORS
  ├─ Swagger UI (development only)
  ├─ HTTPS Redirection
  └─ Endpoint Routing
```

On startup, the database is seeded with sample data via `InMemorySeeder.Seed()`.

The `Program` class exposes a `public partial class Program { }` declaration to enable `WebApplicationFactory<Program>` usage in integration tests.

---

### Endpoint Registration Pattern

Endpoints are registered through a clean, extensible pattern using a custom `IEndpoint` interface:

```csharp
public interface IEndpoint
{
    static abstract void MapEndpoints(IEndpointRouteBuilder app);
}
```

The `Endpoints.cs` file defines an extension method `MapEndpoints()` that:
1. Creates a route group at `/api`
2. Creates a nested group at `/tasks` with `AllowAnonymous()`
3. Calls a generic `MapEndpoint<TEndpoint>()` method for each endpoint class

This pattern uses **C# 11 static abstract interface members** to provide a type-safe, convention-based way to register endpoints without reflection or manual wiring.

---

### Data Layer

**Domain Entity — `EntityTask`:**

| Property | Type | Description |
|----------|------|-------------|
| `Id` | `int?` | Auto-generated primary key |
| `Title` | `string?` | Task title (max 200 chars) |
| `Description` | `string?` | Task description (max 1000 chars) |
| `Status` | `EStatus?` | New, InProgress, Done |
| `Priority` | `EPriority?` | Low, Medium, High |
| `DueDate` | `DateTimeOffset?` | Target completion date |
| `CreatedAt` | `DateTimeOffset?` | Timestamp of creation |

**Enums:**

- `EStatus` — `New`, `InProgress`, `Done`
- `EPriority` — `Low`, `Medium`, `High`

The entity also exposes `AllowedValues` containing string arrays of valid enum values, used by validators.

**Repository Interface — `ITaskRepo`:**

```
GetAll(TaskQuery)     → List<TaskResponse>
GetById(int)          → TaskResponse?
Create(TaskRequest)   → TaskResponse
Update(int, TaskRequest) → TaskResponse?
Delete(int)           → TaskResponse?
```

The repository returns DTOs directly, keeping the mapping logic centralized in the data access layer.

---

### Feature Endpoints (CRUD)

All endpoints live under `src/Features/Tasks/Endpoints/` and implement the `IEndpoint` interface:

| Endpoint | HTTP Method | Route | Description | Response |
|----------|-------------|-------|-------------|----------|
| `GetAllTaskEndpoint` | `GET` | `/api/tasks` | List all tasks with search & sort | `200 OK` with `List<TaskResponse>` |
| `GetTaskByIdEndpoint` | `GET` | `/api/tasks/{id}` | Get a single task | `200 OK` or `404 Not Found` |
| `CreateTaskEndpoint` | `POST` | `/api/tasks` | Create a new task | `201 Created` with location header |
| `UpdateTaskEndpoint` | `PUT` | `/api/tasks/{id}` | Update an existing task | `204 No Content` or `404 Not Found` |
| `DeleteTaskEndpoint` | `DELETE` | `/api/tasks/{id}` | Delete a task | `204 No Content` or `404 Not Found` |

**Query Parameters for `GET /api/tasks`:**

| Parameter | Description | Default |
|-----------|-------------|---------|
| `q` | Search text (filters by title, case-insensitive) | — |
| `sort` | Sort order (`dueDate:asc` or `dueDate:desc`) | `dueDate:asc` |

---

### DTOs & Mapper

**Request DTO (`TaskRequest`):**
Used for both create and update operations. All fields are nullable strings to support partial updates.

**Response DTO (`TaskResponse`):**
Includes `Id`, string representations of enums, and `DateTimeOffset` date fields.

**TaskMapper (static extension methods):**

```
TaskRequest  →  EntityTask     (string → enum via Enum.TryParse, ISO date parsing)
EntityTask   →  TaskResponse   (enum → string, date formatting)
```

Date handling uses `CultureInfo.InvariantCulture` for ISO 8601 parsing and normalizes to UTC.

---

### Infrastructure & Persistence

**InMemoryDbContext:**
An EF Core `DbContext` with a `DbSet<EntityTask>` configured via the Fluent API:
- Auto-increment integer primary key
- Required fields: Title, Status, Priority, CreatedAt
- Max lengths: Title (200), Description (1000)
- Enums stored as strings in the database

**InMemorySeeder:**
Seeds three sample tasks on startup if the database is empty:
1. "Task 1" — Status: New, Priority: Medium
2. "Task 2" — Status: InProgress, Priority: High
3. "Task 3" — Status: Done, Priority: Low

**TaskRepo:**
The `ITaskRepo` implementation using EF Core. Notable behavior:
- **Search:** Case-insensitive `Contains` on title
- **Sort:** By `DueDate` ascending or descending
- **Partial Update:** Only overwrites fields that are non-null in the incoming request, preserving existing values for omitted fields

---

### Validation

**FluentValidation** is used for request validation with the following rules for `TaskRequest`:
- `Title` — Required, must not be null or empty
- `Status` — Must be one of the allowed values (`New`, `InProgress`, `Done`)
- `Priority` — Must be one of the allowed values (`Low`, `Medium`, `High`)
- `DueDate` — If provided, must be a valid ISO 8601 date/time string

Validation is applied via a generic **endpoint filter** (`ValidationFilter<T>`). This filter:
1. Intercepts the request before it reaches the endpoint handler
2. Extracts the first argument of the specified type
3. Runs the registered FluentValidation validator
4. Returns an RFC 7807 `HttpValidationProblemDetails` response on failure

---

### Error Handling

A global exception handler (`GlobalExceptionHandler`) implements `IExceptionHandler` to catch unhandled exceptions and return standardized RFC 7807 `ProblemDetails` responses:

- Maps exception types to appropriate HTTP status codes
- Includes `traceId` for request correlation
- Includes `timestamp` for debugging

Combined with `ProblemDetails` middleware, all error responses follow a consistent format.

---

### CORS Configuration

A named CORS policy `"AllowFrontend"` is configured to allow:
- **Origin:** `http://localhost:4200` (Angular dev server)
- **Methods:** Any
- **Headers:** Any

---

### Containerization

A multi-stage **Dockerfile** is included:

```
Stage 1 (base):    mcr.microsoft.com/dotnet/aspnet:8.0    — Runtime image
Stage 2 (build):   mcr.microsoft.com/dotnet/sdk:8.0       — Build with SDK
Stage 3 (publish): Publish optimized binaries
Stage 4 (final):   Copy published output into runtime image
```

Exposes ports **8080** (HTTP) and **8081** (HTTPS). The container runs as a non-root user via `$APP_UID`.

---

## Frontend — TaskTrackerFrontend

### Project Setup

The frontend is an **Angular 21** application scaffolded with the Angular CLI. It uses:
- **SCSS** for component and global styling
- **Bootstrap 5** imported globally via SCSS
- **ng-bootstrap** for Angular-native Bootstrap widgets (datepicker, timepicker)
- **Vitest** as the test runner (modern alternative to Karma/Jasmine)
- **Prettier** for consistent code formatting
- **Strict TypeScript** configuration with all strict checks enabled

---

### Application Bootstrap

The app uses Angular's **standalone bootstrap** pattern:

```typescript
bootstrapApplication(App, appConfig)
```

The root `App` component renders a `Header` component and a `<router-outlet>` for page navigation.

---

### Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Displays the task grid with search and sort |
| `/tasks/new` | `CreateTask` | Form to create a new task |
| `/tasks/:id/edit` | `EditTask` | Form to edit an existing task |

---

### State Management with Signals

The `TaskService` uses Angular **signals** for reactive state management:

```
Writable Signals:
  ├─ _tasks: WritableSignal<ITask[]>     — All tasks
  ├─ _task: WritableSignal<ITask | null> — Single selected task
  ├─ _loading: WritableSignal<boolean>   — Loading state
  └─ _error: WritableSignal<string>      — Error message

Exposed as readonly signals to components.
```

This approach provides:
- **Fine-grained reactivity** — Components only re-render when their consumed signals change
- **No external dependencies** — Built into Angular core, no need for NgRx or other state libraries
- **Simple mental model** — Read with `signal()`, write with `set()` / `update()`

---

### Models & DTOs

The frontend maintains a clear **layered model** structure:

```
API Layer:     TaskDTO / CreateTaskDTO    (matches API JSON shape, dates as strings)
                       ↕  TaskMapper
Domain Layer:  ITask / CreateTaskPayload  (app-level model, dates as Date objects)
                       ↕  mapToFormTask / mapToITask
Form Layer:    IFormTask                  (all strings, bound to form controls)
```

An `ApiValidationError` model matches the backend's RFC 7807 `HttpValidationProblemDetails` shape for type-safe error handling.

---

### Components

```
Core Components:
  ├─ Header              — Static navigation bar with app title
  ├─ TaskCard            — Displays a single task as a Bootstrap card
  │                        (priority badge, status, edit/delete actions)
  ├─ TaskCardGrid        — Main task grid with search, sort, and responsive layout
  │                        (debounced search via RxJS, Bootstrap grid system)
  └─ TaskForm            — Reusable reactive form for create/edit operations
                           (NgbDatepicker, NgbTimepicker, custom validators)

Feature Pages:
  ├─ Home                — Wraps TaskCardGrid
  ├─ CreateTask          — TaskForm + create API call + server error mapping
  └─ EditTask            — TaskForm + load-by-id + update API call
```

**TaskCardGrid** features:
- Debounced search input (400ms delay) using RxJS `debounceTime` → `distinctUntilChanged` → `switchMap`
- Sort toggle (ascending/descending by due date)
- Responsive Bootstrap grid layout (1/2/3 columns based on viewport)
- Loading spinner, error alerts, and empty-state messaging

**TaskForm** features:
- Angular Reactive Forms with built-in and custom validators
- `oneOf()` validator for enum fields (status, priority)
- `isoDateTime()` validator for date fields
- ng-bootstrap `NgbDatepicker` and `NgbTimepicker` for date/time selection
- Accepts an `initialValue` input for pre-populating in edit mode
- Emits a `submitted` output event with the form payload

---

### Form Handling & Validation

**Client-Side Validation:**

| Field | Rules |
|-------|-------|
| Title | Required, max 100 characters |
| Status | Required, must be one of: New, InProgress, Done |
| Priority | Required, must be one of: Low, Medium, High |
| Description | Optional, free text |
| Due Date | Optional, must be valid ISO 8601 datetime |

Validation errors are shown inline beneath each field in the form template.

---

### Server-Side Error Mapping

The `applyApiErrors()` utility function maps backend RFC 7807 validation errors directly onto Angular form controls:

1. Receives an `ApiValidationError` (matching `HttpValidationProblemDetails`)
2. Iterates over the `errors` dictionary
3. Performs case-insensitive field matching (e.g., `duedate` → `dueDate`)
4. Sets a `serverError` validation error on the corresponding form control

This creates a seamless validation experience where server-side errors appear inline in the form, identical to client-side errors.

---

## Integration Tests

The test project uses **xUnit** with `Microsoft.AspNetCore.Mvc.Testing` to run the API in-process.

**Test Fixture — `TaskTrackerApiFactory`:**
- Extends `WebApplicationFactory<Program>`
- Replaces the production `InMemoryDbContext` with a test-specific instance
- Uses a unique database name per factory (`TestDb-{Guid}`) for test isolation
- Sets the environment to `Development`

**Test Cases:**

| Test | What It Verifies |
|------|------------------|
| `GetTasks_ReturnsSuccessStatusCode` | `GET /api/tasks` returns 200 with the 3 seeded tasks |
| `GetTaskById_ReturnsCorrectTask` | `POST /api/tasks` with invalid data returns 400 with RFC 7807 validation errors |

---

## CI/CD Pipeline

A **GitHub Actions** workflow (`.github/workflows/dotnet-ci.yaml`) runs on every push and pull request to `main`:

```yaml
Steps:
  1. Checkout code
  2. Setup .NET 8.0 SDK
  3. Restore NuGet dependencies
  4. Build the integration test project
  5. Run tests
```

The pipeline runs on **Ubuntu** and ensures that all integration tests pass before code is merged.

---

## API Specification

### Base URL

```
Development: http://localhost:5293/api
Swagger UI:  http://localhost:5293/swagger
```

### Endpoints

```
GET    /api/tasks          — List all tasks (query: ?q=search&sort=dueDate:asc)
GET    /api/tasks/{id}     — Get task by ID
POST   /api/tasks          — Create a new task
PUT    /api/tasks/{id}     — Update an existing task
DELETE /api/tasks/{id}     — Delete a task
```

### Request Body (POST / PUT)

```json
{
  "title": "Finish report",
  "description": "Complete the Q4 financial report",
  "status": "New",
  "priority": "High",
  "dueDate": "2026-04-01T17:00:00.0000000+00:00"
}
```

### Response Body

```json
{
  "id": 1,
  "title": "Finish report",
  "description": "Complete the Q4 financial report",
  "status": "New",
  "priority": "High",
  "dueDate": "2026-04-01T17:00:00.0000000+00:00",
  "createdAt": "2026-03-16T10:30:00.0000000+00:00"
}
```

### Validation Error Response (RFC 7807)

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Validation Error",
  "status": 400,
  "errors": {
    "Title": ["'Title' must not be empty."],
    "Priority": ["'Priority' must be one of: Low, Medium, High"]
  }
}
```

---

## How to Run

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (LTS)
- [Angular CLI](https://angular.dev/) (`npm install -g @angular/cli`)

### Backend

```bash
cd TaskTrackerWebAPI
dotnet restore
dotnet run
```

The API will start at `http://localhost:5293` with Swagger UI available at `/swagger`.

### Frontend

```bash
cd TaskTrackerFrontend
npm install
ng serve
```

The app will be available at `http://localhost:4200`.

### Tests

```bash
cd TaskTracker.IntergrationTests
dotnet test
```

### Docker

```bash
cd TaskTrackerWebAPI
docker build -t task-tracker-api .
docker run -p 8080:8080 task-tracker-api
```

---

## Summary of Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Minimal API over Controllers** | Less boilerplate, functional style, better suited for small/medium APIs |
| **Vertical Slice Architecture** | Feature-centric organization improves cohesion and makes features easy to add or remove independently |
| **Static Abstract Interface for Endpoints** | Type-safe, self-registering endpoint pattern without reflection |
| **EF Core InMemory Provider** | Rapid prototyping without database setup; easily replaceable with SQL Server or PostgreSQL |
| **FluentValidation + Endpoint Filters** | Declarative validation rules applied as cross-cutting concerns, keeping endpoint handlers clean |
| **RFC 7807 ProblemDetails** | Industry-standard error format enabling consistent error handling across frontend and backend |
| **Angular Signals over NgRx** | Lightweight, built-in reactivity suitable for application-scale state without external dependencies |
| **Standalone Components** | Modern Angular best practice — eliminates NgModule boilerplate |
| **Three-Layer DTO Mapping (Frontend)** | Clean separation between API, domain, and form representations |
| **Server Error → Form Control Mapping** | Seamless UX where server validation errors appear inline, indistinguishable from client-side errors |
| **Vitest over Karma** | Modern, fast test runner aligned with the JavaScript ecosystem's direction |
| **GitHub Actions CI** | Automated testing on every push/PR ensures code quality before merging |
| **Docker Multi-Stage Build** | Optimized container images with minimal attack surface (runtime-only final image) |
