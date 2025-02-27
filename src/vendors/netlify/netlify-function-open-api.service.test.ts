import { z } from "zod";
import { BaseController } from "../../shared/base-components/base.controller";
import { HttpDtoType, HttpMethod, HttpStatusCode } from "../../shared/types/http.types";
import { Body, NetlifyFunctionHttpController, NetlifyHttpMethod, Params, Query } from "./decorators";
import { NetlifyFunctionOpenApiService } from "./netlify-function-open-api.service";

@NetlifyFunctionHttpController({
  path: "/test",
})
class TestController extends BaseController {
  @NetlifyHttpMethod({
    method: HttpMethod.GET,
    description: "Test Get",
    request: {},
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Test Get",
        type: HttpDtoType.JSON,
        schema: z.object({}),
      },
      errors: [],
    },
  })
  async getTest() {}

  @NetlifyHttpMethod({
    method: HttpMethod.GET,
    path: "/test/:someId/:someOtherId",
    description: "Test Get With Params",
    request: {
      query: z.object({
        someQuery: z.string(),
      }),
      params: z.object({
        someId: z.string(),
        someOtherId: z.string(),
      }),
    },
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Test Get With Params",
        type: HttpDtoType.JSON,
        schema: z.object({}),
      },
      errors: [
        {
          statusCode: HttpStatusCode.BAD_REQUEST,
          description: "Bad Request",
          type: HttpDtoType.JSON,
          schema: z.object({}),
        },
      ],
    },
  })
  async getParamTest(
    @Query() query: { someQuery: string },
    @Params() params: { someId: string },
    @Body() body: { someId: string }
  ) {}

  @NetlifyHttpMethod({
    method: HttpMethod.POST,
    path: "/test/:someId",
    description: "Test Post",
    request: {
      params: z.object({
        someId: z.string(),
      }),
      body: z.object({
        someId: z.string(),
      }),
    },
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Test",
        type: HttpDtoType.JSON,
        schema: z.object({
          id: z.string(),
        }),
      },
      errors: [],
    },
  })
  async postTest(@Body() body: { id: string }, @Params() params: { someId: string }) {}
}

describe("NetlifyFunctionOpenApiService", () => {
  const controllers = [TestController];

  it("should create open api definitions from controller", () => {
    const service = new NetlifyFunctionOpenApiService();
    const definitions = service.getOpenApiDefinitions(controllers);
    expect(definitions).toBeDefined();
    expect(definitions.length).toBe(3);
  });

  it("should create open api definitions for get without path", () => {
    const service = new NetlifyFunctionOpenApiService();
    const definitions = service.getOpenApiDefinitions(controllers);
    expect(definitions).toBeDefined();
    expect(definitions.length).toBe(3);
    expect(definitions[0]).toEqual({
      type: "route",
      route: {
        operationId: "/test-GET",
        method: "get",
        path: "/test",
        description: "Test Get",
        responses: {
          [HttpStatusCode.OK]: {
            description: "Test Get",
            content: {
              [HttpDtoType.JSON]: {
                schema: expect.any(z.Schema),
              },
            },
          },
        },
      },
    });
  });

  it("should create open api definitions for get with path", () => {
    const service = new NetlifyFunctionOpenApiService();
    const definitions = service.getOpenApiDefinitions(controllers);
    expect(definitions).toBeDefined();
    expect(definitions.length).toBe(3);
    expect(definitions[1]).toEqual({
      type: "route",
      route: {
        operationId: "/test/test/{someId}/{someOtherId}-GET",
        method: "get",
        path: "/test/test/{someId}/{someOtherId}",
        description: "Test Get With Params",
        request: {
          query: expect.any(z.Schema),
          params: expect.any(z.Schema),
        },
        responses: {
          [HttpStatusCode.OK]: {
            description: expect.any(String),
            content: {
              [HttpDtoType.JSON]: {
                schema: expect.any(z.Schema),
              },
            },
          },
          [HttpStatusCode.BAD_REQUEST]: {
            description: expect.any(String),
            content: {
              [HttpDtoType.JSON]: {
                schema: expect.any(z.Schema),
              },
            },
          },
        },
      },
    });
  });

  it("should create open api definitions for post ", () => {
    const service = new NetlifyFunctionOpenApiService();
    const definitions = service.getOpenApiDefinitions(controllers);
    expect(definitions).toBeDefined();
    expect(definitions.length).toBe(3);
    expect(definitions[2]).toEqual({
      type: "route",
      route: {
        operationId: "/test/test/{someId}-POST",
        method: "post",
        path: "/test/test/{someId}",
        description: "Test Post",
        request: {
          params: expect.any(z.Schema),
          body: {
            content: {
              [HttpDtoType.JSON]: {
                schema: expect.any(z.Schema),
              },
            },
          },
        },
        responses: {
          [HttpStatusCode.OK]: {
            description: expect.any(String),
            content: {
              [HttpDtoType.JSON]: {
                schema: expect.any(z.Schema),
              },
            },
          },
        },
      },
    });
  });
});
