const definition = {
  openapi: "3.0.0",
  info: {
    title: "Chess API",
    description: "This is an API documentation for Chess Web Application",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://chess-z2o4.onrender.com/",
      description: "Deployment server",
    },
    {
      url: "http://localhost:3500/api/",
      description: "Development Server",
    },
  ],
  paths: {
    "/create": {
      tags: 'Account',
      post: {
        summary: "Create an account",
        description: "Creates a new user account with the provided details.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                  date_registered: {
                    type: "string",
                    format: "date",
                  },
                },
                required: ["username", "password", "date_registered"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Account created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          409: {
            description: "Conflict - Account already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          422: {
            description: "Unprocessable Entity",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  definition,
  apis: ["../index.js"],
};

export default options;
