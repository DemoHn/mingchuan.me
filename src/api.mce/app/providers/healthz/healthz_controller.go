package healthz

import (
	"os"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/app/drivers/swagger/models"
	apiMisc "mingchuan.me/app/drivers/swagger/restapi/operations/misc"
)

// Controller -
type Controller struct {
	*swagger.API
}

// NewController -
func NewController(api *swagger.Driver) *Controller {
	cc := &Controller{
		API: api.GetAPI(),
	}

	cc.RegisterAPI()
	return cc
}

// RegisterAPI -
func (c *Controller) RegisterAPI() {
	c.MiscHealthCheckHandler = apiMisc.HealthCheckHandlerFunc(
		func(params apiMisc.HealthCheckParams) middleware.Responder {
			resp := models.HealthResponse{
				Status:      true,
				Timestamp:   int64(time.Now().Unix()),
				Environment: os.Getenv("MCE_ENV"),
			}

			return apiMisc.NewHealthCheckOK().WithPayload(&resp)
		})
}
