import { Body, Header, HttpMethodParams, Params, Query, getParams } from "./function-http-method-params.decorator";

describe("HTTP Method Parameter Decorators", () => {
  // Test class to use decorators
  class TestController {
    testMethod(@Params() params: any, @Body() body: any, @Query() query: any, @Header() headers: any) {
      return { params, body, query, headers };
    }

    singleParamMethod(@Body() body: any) {
      return { body };
    }
  }

  describe("Parameter Decorators", () => {
    it("should properly decorate parameters with @Params", () => {
      const params = getParams(TestController.prototype, "testMethod");
      expect(params[0]).toBe(HttpMethodParams.PARAMS);
    });

    it("should properly decorate parameters with @Body", () => {
      const params = getParams(TestController.prototype, "testMethod");
      expect(params[1]).toBe(HttpMethodParams.BODY);
    });

    it("should properly decorate parameters with @Query", () => {
      const params = getParams(TestController.prototype, "testMethod");
      expect(params[2]).toBe(HttpMethodParams.QUERY);
    });

    it("should properly decorate parameters with @Header", () => {
      const params = getParams(TestController.prototype, "testMethod");
      expect(params[3]).toBe(HttpMethodParams.HEADER);
    });

    it("should handle methods with single parameter", () => {
      const params = getParams(TestController.prototype, "singleParamMethod");
      expect(params).toHaveLength(1);
      expect(params[0]).toBe(HttpMethodParams.BODY);
    });
  });

  describe("Error Handling", () => {
    it("should throw error when propertyKey is undefined in getParams", () => {
      expect(() => {
        getParams({}, undefined);
      }).toThrow("propertyKey cannot be undefined");
    });

    it("should return empty array for non-decorated parameters", () => {
      class NonDecoratedController {
        method(param: any) {}
      }

      const params = getParams(NonDecoratedController.prototype, "method");
      expect(params).toEqual([]);
    });
  });

  describe("Multiple Decorators on Same Method", () => {
    class MultiParamController {
      method(@Body() body1: any, @Body() body2: any, @Params() params1: any, @Params() params2: any) {}
    }

    it("should handle multiple parameters with same decorator type", () => {
      const params = getParams(MultiParamController.prototype, "method");
      expect(params).toEqual([
        HttpMethodParams.BODY,
        HttpMethodParams.BODY,
        HttpMethodParams.PARAMS,
        HttpMethodParams.PARAMS,
      ]);
    });
  });
});
