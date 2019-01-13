package account

import (
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/app/drivers/swagger/models"

	apiAccount "mingchuan.me/app/drivers/swagger/restapi/operations/account"
	"mingchuan.me/app/errors"
)

// Controller - create a struct with instance inside it
// this is to help do mock testing
type Controller struct {
	*swagger.API
	*Service
}

// NewController -
func NewController(api *swagger.Driver, service *Service) *Controller {
	c := &Controller{
		API:     api.GetAPI(),
		Service: service,
	}

	// register routes
	c.RegisterAdmin()
	c.Login()

	return c
}

// RegisterAdmin -
func (c *Controller) RegisterAdmin() {
	API := c.API
	service := c.Service

	API.AccountRegisterAdminHandler = apiAccount.RegisterAdminHandlerFunc(
		func(params apiAccount.RegisterAdminParams) middleware.Responder {
			request := params.Request
			// parse params
			name := swag.StringValue(request.Name)
			password := swag.StringValue(request.Password)
			adminKey := swag.StringValue(request.AdminKey)

			// service
			jwt, err := service.RegisterAdmin(name, password, adminKey)

			if err != nil {
				// TODO: more specific error
				wErr := errors.UnknownError(err)
				return apiAccount.NewRegisterAdminBadRequest().WithPayload(swagger.ModelServiceError(wErr))
			}
			// construct payload
			resp := models.JwtResponse{
				Jwt: swag.String(jwt),
			}
			return apiAccount.NewRegisterAdminOK().WithPayload(&resp)
		})
}

// Login -
func (c *Controller) Login() {
	API := c.API
	service := c.Service

	API.AccountLoginHandler = apiAccount.LoginHandlerFunc(
		func(params apiAccount.LoginParams) middleware.Responder {
			request := params.Request
			// parse params
			name := swag.StringValue(request.Name)
			password := swag.StringValue(request.Password)

			// service
			jwt, err := service.VerifyAccount(name, password)

			if err != nil {
				wErr := errors.UnknownError(err)
				return apiAccount.NewLoginBadRequest().WithPayload(swagger.ModelServiceError(wErr))
			}

			resp := models.JwtResponse{
				Jwt: swag.String(jwt),
			}

			return apiAccount.NewLoginOK().WithPayload(&resp)
		})
}
