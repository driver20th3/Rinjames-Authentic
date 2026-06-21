import { env } from './env'

/**
 * Minimal but functional OpenAPI 3 document. Served at /api-docs.
 * Extend `paths` as the API grows.
 */
export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'RinJames Authentic API',
    version: '1.0.0',
    description:
      'Backend API cho web trưng bày giày/quần áo/túi. Khách xem sản phẩm rồi inbox FB/IG để đặt.'
  },
  servers: [{ url: `http://localhost:${env.PORT}`, description: 'Local' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {},
          pagination: { type: 'object', nullable: true }
        }
      }
    }
  },
  tags: [
    { name: 'Auth', description: 'Đăng ký / đăng nhập / token' },
    { name: 'User', description: 'Hồ sơ & địa chỉ' },
    { name: 'Product', description: 'Sản phẩm (trưng bày)' },
    { name: 'Category', description: 'Danh mục' }
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng ký tài khoản email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  phone: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'Created' } }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập email/password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'OK (trả accessToken + refreshToken)' } }
      }
    },
    '/api/auth/facebook': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập bằng Facebook access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['accessToken'],
                properties: { accessToken: { type: 'string' } }
              }
            }
          }
        },
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Cấp access token mới từ refresh token',
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api/auth/logout': {
      post: { tags: ['Auth'], summary: 'Đăng xuất', responses: { '200': { description: 'OK' } } }
    },
    '/api/users/me': {
      get: {
        tags: ['User'],
        summary: 'Hồ sơ của tôi',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'OK' } }
      },
      put: {
        tags: ['User'],
        summary: 'Cập nhật hồ sơ',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api/products': {
      get: {
        tags: ['Product'],
        summary: 'Danh sách sản phẩm (filter/search/sort/pagination)',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'slug hoặc id' },
          { name: 'brand', in: 'query', schema: { type: 'string' } },
          { name: 'size', in: 'query', schema: { type: 'number' } },
          { name: 'color', in: 'query', schema: { type: 'string' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'featured', in: 'query', schema: { type: 'boolean' } },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', enum: ['newest', 'oldest', 'price-asc', 'price-desc', 'name'] }
          },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } }
        ],
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api/products/{slug}': {
      get: {
        tags: ['Product'],
        summary: 'Chi tiết sản phẩm theo slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api/categories': {
      get: { tags: ['Category'], summary: 'Danh sách danh mục', responses: { '200': { description: 'OK' } } }
    }
  }
}
