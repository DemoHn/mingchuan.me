package healthz

import (
	"os"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/app/drivers/swagger/models"
	apiMisc "mingchuan.me/app/drviers/swagger/restapi/operations/misc"
)

// RegisterAPI -
func RegisterAPI(API *swagger.API) {
	API.MiscHealthCheckHandler = apiMisc.HealthCheckHandlerFunc(
		func(params apiMisc.HealthCheckParams) middleware.Responder {
			resp := models.HealthResponse{
				Status:      true,
				Timestamp:   int64(time.Now().Unix()),
				Environment: os.Getenv("MCE_ENV"),
			}

			return apiMisc.NewHealthCheckOK().WithPayload(&resp)
		})
}
