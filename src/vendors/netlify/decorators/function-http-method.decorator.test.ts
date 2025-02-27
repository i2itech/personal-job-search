import { z } from "zod";
import { HttpDtoType, HttpMethod, HttpStatusCode } from "../../../shared/types/http.types";
import { NetlifyFunctionController } from "../netlify-function.controller";
import * as utils from "../netlify-function.utils";
import * as paramsDecorator from "./function-http-method-params.decorator";
import { HttpMethodParams } from "./function-http-method-params.decorator";
import { NetlifyHttpMethod, getNetlifyHttpMethod } from "./function-http-method.decorator";

describe("NetlifyHttpMethod Decorator", () => {
  // Mock class for testing
  class TestController extends NetlifyFunctionController {
    @NetlifyHttpMethod({
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
    })
    async testMethod(params: any, body: any) {
      return { params, body };
    }
  }

  const mockParams = { id: "123" } as any;
  const mockBody = { data: "test" } as any;
  const mockContext = { context: "test" } as any;
  const mockRequest = new Request("http://test.com");

  beforeEach(() => {
    jest.spyOn(utils, "getFunctionParams").mockReturnValue(mockParams);
    jest.spyOn(utils, "getFunctionBody").mockReturnValue(mockBody);
    jest.spyOn(paramsDecorator, "getParams").mockReturnValue([HttpMethodParams.PARAMS, HttpMethodParams.BODY]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should decorate method and store metadata", () => {
    const method = getNetlifyHttpMethod(new TestController(), HttpMethod.GET);
    expect(method).toBeDefined();
    expect(method?.metadata.method).toBe(HttpMethod.GET);
  });

  it("should execute decorated method with correct parameters", async () => {
    const controller = new TestController();
    const method = getNetlifyHttpMethod(controller, HttpMethod.GET);

    const result = await method?.handler(mockRequest, mockContext);

    expect(result).toEqual({ params: mockParams, body: mockBody });
    expect(utils.getFunctionParams).toHaveBeenCalledWith(mockContext);
    expect(utils.getFunctionBody).toHaveBeenCalledWith(mockRequest);
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
    const method = getNetlifyHttpMethod(new TestController(), HttpMethod.POST);
    expect(method).toBeUndefined();
  });
});
