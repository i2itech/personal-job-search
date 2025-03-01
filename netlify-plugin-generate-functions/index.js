module.exports = {
  onPreBuild: async ({ utils }) => {
    // Your plugin logic here
    try {
      // Generate your functions here
    } catch (error) {
      utils.build.failBuild("Error generating functions", { error });
    }
  },
};
