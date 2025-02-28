import { z } from "zod";
import { HttpDtoType, HttpMethod, HttpStatusCode } from "../../../shared/types/http.types";
import { NetlifyFunctionController } from "../netlify-function.controller";
import { Body, Params } from "./function-http-method-params.decorator";
import {
  NetlifyHttpMethod,
  getNetlifyHttpMethodByFunction,
  getNetlifyHttpMethodByPath,
} from "./function-http-method.decorator";

// Mock class for testing
class TestController extends NetlifyFunctionController {
  @NetlifyHttpMethod({
    method: HttpMethod.POST,
    description: "Test method",
    request: {},
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Test method",
        type: HttpDtoType.JSON,
        schema: z.object({}),
      },
      errors: [],
    },
  })
  async testMethod(@Body() body: any, @Params() params: any) {
    return { params, body };
  }
}
describe("NetlifyHttpMethod Decorator", () => {
  const mockParams = { id: "123" } as any;
  const mockBody = { data: "test" } as any;
  const mockContext = { params: mockParams } as any;
  const mockRequest = { method: HttpMethod.POST, json: () => Promise.resolve(mockBody) } as any;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should decorate method and store metadata", () => {
    const method = getNetlifyHttpMethodByFunction(TestController, "testMethod");
    expect(method).toBeDefined();
    expect(method?.metadata.method).toBe(HttpMethod.POST);
  });

  it("should execute decorated method with correct parameters", async () => {
    const controller = new TestController();
    const method = getNetlifyHttpMethodByFunction(controller, "testMethod");

    const result = await method?.handler(mockRequest, mockContext);

    expect(result).toEqual({ params: mockParams, body: mockBody });
  });

  it("should throw error when propertyKey is undefined", () => {
    expect(() => {
      NetlifyHttpMethod({
        method: HttpMethod.GET,
        description: "Test method",
        request: {},
        responses: {
          success: {
            statusCode: HttpStatusCode.OK,
            description: "Test method",
            type: HttpDtoType.JSON,
            schema: z.object({}),
          },
          errors: [],
        },
      })(TestController.prototype, undefined as any, {} as PropertyDescriptor);
    }).toThrow("propertyKey cannot be undefined");
  });

  it("should return undefined for non-existent HTTP method", () => {
    const method = getNetlifyHttpMethodByFunction(new TestController(), "undeclaredMethod");
    expect(method).toBeUndefined();
  });
});

describe("getNetlifyHttpMethodByPath", () => {
  // Test class with multiple routes
  class TestRoutesController extends NetlifyFunctionController {
    @NetlifyHttpMethod({
      method: HttpMethod.GET,
      path: "/users",
      description: "Get users",
      request: {},
      responses: {
        success: {
          statusCode: HttpStatusCode.OK,
          description: "Users retrieved",
          type: HttpDtoType.JSON,
          schema: z.object({}),
        },
        errors: [],
      },
    })
    getUsers() {}

    @NetlifyHttpMethod({
      method: HttpMethod.GET,
      path: "/users/:id",
      description: "Get user by id",
      request: {},
      responses: {
        success: {
          statusCode: HttpStatusCode.OK,
          description: "User retrieved",
          type: HttpDtoType.JSON,
          schema: z.object({}),
        },
        errors: [],
      },
    })
    getUserById() {}

    @NetlifyHttpMethod({
      method: HttpMethod.POST,
      path: "/users",
      description: "Create user",
      request: {},
      responses: {
        success: {
          statusCode: HttpStatusCode.CREATED,
          description: "User created",
          type: HttpDtoType.JSON,
          schema: z.object({}),
        },
        errors: [],
      },
    })
    createUser() {}
  }

  it("should find method by exact path match", () => {
    const controller = new TestRoutesController();
    const method = getNetlifyHttpMethodByPath(controller, "/users", HttpMethod.GET);

    expect(method).toBeDefined();
    expect(method?.metadata.method).toBe(HttpMethod.GET);
    expect(method?.metadata.path).toBe("/users");
  });

  it("should find method with path parameters", () => {
    const controller = new TestRoutesController();
    const method = getNetlifyHttpMethodByPath(controller, "/users/123", HttpMethod.GET);

    expect(method).toBeDefined();
    expect(method?.metadata.method).toBe(HttpMethod.GET);
    expect(method?.metadata.path).toBe("/users/:id");
  });

  it("should match different HTTP methods for same path", () => {
    const controller = new TestRoutesController();

    const getMethod = getNetlifyHttpMethodByPath(controller, "/users", HttpMethod.GET);
    const postMethod = getNetlifyHttpMethodByPath(controller, "/users", HttpMethod.POST);

    expect(getMethod?.metadata.method).toBe(HttpMethod.GET);
    expect(postMethod?.metadata.method).toBe(HttpMethod.POST);
  });

  it("should return undefined for non-existent path", () => {
    const controller = new TestRoutesController();
    const method = getNetlifyHttpMethodByPath(controller, "/non-existent", HttpMethod.GET);

    expect(method).toBeUndefined();
  });

  it("should return undefined for non-existent HTTP method on valid path", () => {
    const controller = new TestRoutesController();
    const method = getNetlifyHttpMethodByPath(controller, "/users", HttpMethod.DELETE);

    expect(method).toBeUndefined();
  });

  it("should work with controller instance or class", () => {
    const controllerInstance = new TestRoutesController();
    const controllerClass = TestRoutesController;

    const methodFromInstance = getNetlifyHttpMethodByPath(controllerInstance, "/users", HttpMethod.GET);
    const methodFromClass = getNetlifyHttpMethodByPath(controllerClass, "/users", HttpMethod.GET);

    expect(methodFromInstance).toBeDefined();
    expect(methodFromClass).toBeDefined();
    expect(methodFromInstance?.metadata).toEqual(methodFromClass?.metadata);
  });
});
