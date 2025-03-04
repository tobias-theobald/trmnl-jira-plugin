/** @type {import('next').NextConfig} */
export default {
    webpack: (webpackConfig, { webpack }) => {
        webpackConfig.resolve.extensionAlias = {
            ".js": [".ts", ".tsx", ".js", ".jsx"],
            ".mjs": [".mts", ".mjs"],
            ".cjs": [".cts", ".cjs"],
        };
        return webpackConfig;
    },
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"],
    },

};