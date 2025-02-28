import { z } from "zod";
import { HttpDtoType, HttpMethod, HttpStatusCode } from "../../../shared/types/http.types";
import { NetlifyFunctionController } from "../netlify-function.controller";
import { Body, Params } from "./function-http-method-params.decorator";
import { NetlifyHttpMethod, getNetlifyHttpMethodByFunction } from "./function-http-method.decorator";

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
