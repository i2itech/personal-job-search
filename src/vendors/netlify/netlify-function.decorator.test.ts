import { Context } from "@netlify/functions";
import { NetlifyHttpMethod, Params, Body } from "./netlify-function.decorator";
import { NetlifyFunctionController } from "./netlify-function.controller";
import { getFunctionParams, getFunctionBody } from "./netlify-function.utils";

// Mock the utility functions
jest.mock("./netlify-function.utils", () => ({
  getFunctionParams: jest.fn(),
  getFunctionBody: jest.fn(),
}));

describe("Netlify Function Decorators", () => {
  // Create a test controller
  class TestController extends NetlifyFunctionController {
    constructor(public readonly dependency: string = "test") {
      super();
    }
    @NetlifyHttpMethod("GET")
    public async testMethod(@Params() params: any, @Body() body: any) {
      return { params, body, dependency: this.dependency };
    }
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("NetlifyHttpMethod Decorator", () => {
    const arrange = () => {
      // Mock return values
      const mockParams = { id: "123" };
      const mockBody = { name: "test" };
      (getFunctionParams as jest.Mock).mockResolvedValue(mockParams);
      (getFunctionBody as jest.Mock).mockResolvedValue(mockBody);

      // Create mock request and context
      const mockRequest = { method: "GET" } as Request;
      const mockContext: any = {
        callbackWaitsForEmptyEventLoop: false,
        functionName: "test",
        functionVersion: "1.0",
        invokedFunctionArn: "",
        memoryLimitInMB: "128",
        awsRequestId: "",
        logGroupName: "",
        logStreamName: "",
        identity: null,
        clientContext: null,
        getRemainingTimeInMillis: () => 0,
        done: () => {},
        fail: () => {},
        succeed: () => {},
      };

      return { mockRequest, mockContext, mockParams, mockBody };
    };

    const subject = async (req: Request, context: Context) => {
      // Get the decorated method
      const controller = new TestController();
      const method = controller.httpMethods["GET"];

      // Execute the method
      const result = await method(req, context);
      return result;
    };
    it("should properly inject params and body", async () => {
      const { mockRequest, mockContext, mockParams, mockBody } = arrange();
      const result = await subject(mockRequest, mockContext);

      // Assertions
      expect(getFunctionParams).toHaveBeenCalledWith(mockContext);
      expect(getFunctionBody).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(
        expect.objectContaining({
          params: mockParams,
          body: mockBody,
        })
      );
    });

    it("should properly inject dependency", async () => {
      const { mockRequest, mockContext } = arrange();
      const result = await subject(mockRequest, mockContext);
      expect(result).toEqual(expect.objectContaining({ dependency: "test" }));
    });
  });
});
