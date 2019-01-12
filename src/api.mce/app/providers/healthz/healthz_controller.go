package healthz

import (
	"os"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"mingchuan.me/api"
	"mingchuan.me/api/models"
	apiMisc "mingchuan.me/api/restapi/operations/misc"
)

// RegisterAPI -
func RegisterAPI(API *api.API) {
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
