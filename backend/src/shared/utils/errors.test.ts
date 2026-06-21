import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  BadRequestError,
  ValidationError
} from './errors'

describe('error classes', () => {
  it('AppError keeps message + statusCode and is operational', () => {
    const e = new AppError('boom', 500)
    expect(e.message).toBe('boom')
    expect(e.statusCode).toBe(500)
    expect(e.isOperational).toBe(true)
    expect(e).toBeInstanceOf(Error)
  })

  it('subclasses set the right status codes', () => {
    expect(new BadRequestError().statusCode).toBe(400)
    expect(new UnauthorizedError().statusCode).toBe(401)
    expect(new ForbiddenError().statusCode).toBe(403)
    expect(new NotFoundError().statusCode).toBe(404)
    expect(new ConflictError().statusCode).toBe(409)
    expect(new ValidationError().statusCode).toBe(422)
  })
})
