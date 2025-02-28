import { NetlifyHttpControllerMetadata } from "../netlify.types";
import {
  NetlifyFunctionHttpController,
  getNetlifyFunctionHttpControllerMetadata,
} from "./function-http-controller.decorator";

describe("NetlifyFunctionHttpController Decorator", () => {
  it("should apply metadata to a class and retrieve it correctly", () => {
    // Define test metadata
    const testMetadata: NetlifyHttpControllerMetadata = {
      path: "/test-path",
    };

    // Create a test class with the decorator
    @NetlifyFunctionHttpController(testMetadata)
    class TestController {}

    // Get the metadata
    const retrievedMetadata = getNetlifyFunctionHttpControllerMetadata(TestController);

    // Assert the metadata matches what we set
    expect(retrievedMetadata).toBeDefined();
    expect(retrievedMetadata.path).toBe(testMetadata.path);
  });

  it("should throw error when getting metadata from non-decorated class", () => {
    // Create a class without the decorator
    class TestControllerWithoutDecorator {}

    // Assert that getting metadata throws an error
    expect(() => {
      getNetlifyFunctionHttpControllerMetadata(TestControllerWithoutDecorator);
    }).toThrow(`No Netlify function http controller metadata found for TestControllerWithoutDecorator`);
  });

  it("should handle multiple decorated classes independently", () => {
    const metadata1: NetlifyHttpControllerMetadata = {
      path: "/path1",
    };

    const metadata2: NetlifyHttpControllerMetadata = {
      path: "/path2",
    };

    @NetlifyFunctionHttpController(metadata1)
    class TestController1 {}

    @NetlifyFunctionHttpController(metadata2)
    class TestController2 {}

    const retrievedMetadata1 = getNetlifyFunctionHttpControllerMetadata(TestController1);
    const retrievedMetadata2 = getNetlifyFunctionHttpControllerMetadata(TestController2);

    expect(retrievedMetadata1.path).toBe(metadata1.path);
    expect(retrievedMetadata2.path).toBe(metadata2.path);
    expect(retrievedMetadata1.path).not.toBe(retrievedMetadata2.path);
  });
});
