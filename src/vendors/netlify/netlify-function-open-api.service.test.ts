import { z } from "zod";
import { BaseController } from "../../shared/components/base.controller";
import { HttpDtoType, HttpMethod, HttpStatusCode } from "../../shared/types/http.types";
import { Body, NetlifyFunctionHttpController, NetlifyHttpMethod, Params, Query } from "./decorators";
import { NetlifyFunctionOpenApiService } from "./netlify-function-open-api.service";

@NetlifyFunctionHttpController({
  path: "/test/:someId",
  description: "Test Controller",
})
class TestController extends BaseController {
  @NetlifyHttpMethod({
    method: HttpMethod.GET,
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
    expect(definitions.length).toBe(2);
  });

  it("should create open api definitions for get with path", () => {
    const service = new NetlifyFunctionOpenApiService();
    const definitions = service.getOpenApiDefinitions(controllers);
    expect(definitions[0]).toEqual({
      type: "route",
      route: {
        operationId: "/test/{someId}-GET",
        method: "get",
        path: "/test/{someId}",
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
    expect(definitions[1]).toEqual({
      type: "route",
      route: {
        operationId: "/test/{someId}-POST",
        method: "post",
        path: "/test/{someId}",
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
