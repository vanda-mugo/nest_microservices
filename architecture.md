# Microservices Monorepo with Turborepo, NestJS, and TCP Communication

This repository demonstrates a scalable microservices architecture using **NestJS**, managed within a **Turborepo** monorepo. Each microservice is self-contained, communicates via TCP (event-driven messaging), and is orchestrated with an API Gateway for external client access. This setup is ideal for teams looking to scale, share code, and manage dependencies efficiently.

---

## Table of Contents

- [What is a Monorepo?](#what-is-a-monorepo)
- [Why Turborepo?](#why-turborepo)
- [How Turborepo Works](#how-turborepo-works)
- [How Nx Compares](#how-nx-compares)
- [Project Structure & Setup](#project-structure--setup)
- [Microservice Creation & Communication](#microservice-creation--communication)
- [API Gateway Integration](#api-gateway-integration)
- [EXPLAIN: Understanding Turbo Tasks](#explain-understanding-turbo-tasks)
- [Key Points and Best Practices](#key-points-and-best-practices)
- [Summary](#summary)

---

## What is a Monorepo?

A **monorepo** (monolithic repository) is a single code repository that contains multiple projects—such as microservices, libraries, and applications—rather than splitting them into separate repositories. This approach enables:

- **Easier code sharing** between projects.
- **Unified dependency management** (e.g., shared libraries).
- **Simplified collaboration** for teams.
- **Atomic changes** across multiple projects.

---

## Why Turborepo?

[Turborepo](https://turbo.build/) is a modern high-performance build system for JavaScript and TypeScript monorepos. It provides:

- **Task pipelining and parallelization** for efficient builds, tests, and deployments.
- **Smart caching** to avoid redundant work and speed up repeated tasks.
- **Workspace support** with `npm`, `pnpm`, or `yarn` for dependency management.
- **Simple configuration** via `turbo.json`.

---

## How Turborepo Works

- **Configuration:**  
  You define build, lint, test, and deploy pipelines for each project using `turbo.json`.
- **Task Execution:**  
  Tasks (like `build`, `start:dev`, `test`) can depend on each other and run in parallel where possible.
- **Caching:**  
  Turborepo caches the results of tasks, reusing them if nothing has changed.
- **Code Sharing:**  
  Utility libraries or shared types/packages can be placed in the `/packages` directory and imported across all microservices.

---

## How Nx Compares

[Nx](https://nx.dev/) is another monorepo tool with similar goals, but it adds:

- **Advanced code generation** (scaffolding new services or libraries).
- **Dependency graph visualization** to understand relationships.
- **Selective rebuilding/testing** based on what changed.
- **Rich plugin ecosystem** for frameworks like NestJS, React, Angular, etc.
- **Generators** for rapid project setup.

Both tools enable scalable monorepo management, but Nx is more feature-rich for large, complex workspaces. Turborepo is lightweight and fast, making it ideal for many Node.js/TypeScript projects.

---

## Project Structure & Setup

### 1. Install Dependencies

```bash
npm install @nestjs/microservices
```

### 2. Create the Monorepo

```bash
npx create-turbo@latest microservices
```

This scaffolds the monorepo structure, where you can add your microservices as separate apps.

### 3. Scaffold Microservices

Within the `/apps` folder, generate three NestJS microservices:

```bash
nest new order-service
nest new product-service
nest new user-service
```

Each microservice will have its own isolated codebase, configs, and dependencies (with shared code in `/packages` if needed).

---

## Microservice Creation & Communication

NestJS provides robust support for microservices and message-based architectures. Instead of regular HTTP controllers, microservices communicate via message brokers (TCP, Kafka, RabbitMQ, etc.).

### Example: Creating a TCP Microservice

```typescript
// main.ts for order-service
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  AppModule,
  {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 4001,
    },
  },
);
await app.listen();
console.log('Order Service is listening on port 4001');
```

**Key Points:**
- `host` and `port` specify where the microservice will listen for TCP messages.
- This setup is event-driven, not RESTful.

### Microservice Controller Example

```typescript
@Controller('orders')
export class OrdersController {
  @MessagePattern('create-order')
  createOrder(@Payload() order: string) {
    console.log('Order Received in the order microservice:', order);
    return { message: 'Order data received successfully', order };
  }
}
```

- The `@MessagePattern` decorator binds a method to a specific message type (`create-order`).
- This allows the service to respond to messages from other services or gateways.

---

## API Gateway Integration

An API Gateway acts as the single entry point for clients, exposing RESTful endpoints and routing requests to the appropriate microservices via TCP.

### Setting Up the API Gateway

1. **Generate the Gateway:**

   ```bash
   nest new api_gateway
   ```

2. **Register Microservice Clients:**

   In `AppModule`, use the `ClientsModule` to configure TCP clients for each microservice:

   ```typescript
   @Module({
     imports: [
       ClientsModule.register([
         {
           name: MICROSERVICES_CLIENTS.USERS_SERVICE,
           transport: Transport.TCP,
           options: { host: 'localhost', port: 4003 },
         },
         {
           name: MICROSERVICES_CLIENTS.PRODUCTS_SERVICE,
           transport: Transport.TCP,
           options: { host: 'localhost', port: 4002 },
         },
         {
           name: MICROSERVICES_CLIENTS.ORDERS_SERVICE,
           transport: Transport.TCP,
           options: { host: 'localhost', port: 4001 },
         },
       ]),
     ],
     controllers: [AppController, OrdersController],
     providers: [AppService],
   })
   export class AppModule {}
   ```

   - The `name` field (e.g., `MICROSERVICES_CLIENTS.ORDERS_SERVICE`) is crucial for dependency injection within your application. It **does not** affect network routing, but you must use the correct name when injecting a client elsewhere in your code.

3. **Controller Example in API Gateway:**

   ```typescript
   @Controller('orders')
   export class OrdersController {
     constructor(
       @Inject(MICROSERVICES_CLIENTS.ORDERS_SERVICE)
       private readonly ordersServiceClient: ClientProxy,
     ) {}

     @Post()
     createOrder(@Body() orderData: any) {
       return this.ordersServiceClient.send('create-order', orderData);
     }
   }
   ```

   - The `send` method routes the message to the `order-service` microservice over TCP.
   - The message pattern (`'create-order'`) **must match** the pattern in the target microservice's controller.

---

## === EXPLAIN ===

### Understanding Turbo Tasks

Within your Turborepo, you can define custom scripts and task dependencies in your `package.json` and `turbo.json` files.

#### Example: package.json

```json
"scripts": {
  "start:dev": "turbo run start:dev"
}
```

- This means that running `npm run start:dev` in the root will invoke Turborepo to run the `start:dev` script in all workspaces.

#### Example: turbo.json

```json
{
  "pipeline": {
    "start:dev": {
      "dependsOn": ["^dev"]
    }
  }
}
```

- Here, `start:dev` depends on the `dev` script in all immediate dependencies (the `^` symbol).
- **In practice:** When you start development servers, Turborepo ensures all necessary dependencies are built/started first, and orchestrates task execution in the optimal order.
- **Benefits:** No need to manually manage build order or worry about stale builds—Turborepo handles all dependencies and invalidation for you, with blazing-fast parallel execution and caching.

**Summary:**  
The combination of `"start:dev": "turbo run start:dev"` in your scripts and the pipeline configuration in `turbo.json` allows you to start all your microservices in development mode efficiently, handling dependencies and rebuilds automatically.

---

## Key Points and Best Practices

- **Project Structure:**  
  Keep each microservice in its own folder under `/apps`, and shared code in `/packages`.

- **Communication:**  
  Use message patterns (`@MessagePattern`) to define how microservices handle events. The API Gateway sends messages using matching patterns.

- **Dependency Injection:**  
  Always use the registered `name` when injecting microservice clients to avoid confusion and bugs.

- **Scaling:**  
  This architecture allows you to add new microservices, shared libraries, or gateway routes with minimal effort.

- **Security:**  
  In production, avoid using `'localhost'` as the host—use internal IPs or `0.0.0.0` and secure your network as needed.

---

## Summary

This monorepo setup—powered by **Turborepo** and **NestJS**—offers a scalable, maintainable, and efficient approach to building microservices architectures. By combining event-driven service communication, shared code management, and modern developer tooling, you can build robust distributed systems with ease.

**Happy coding!**

---