package healthz

import (
	"mingchuan.me/app/drivers/gorm"
	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/infra"
)

// Provider -
type Provider struct {
	controller *Controller
}

// New - new healthz provider
func New(infra *infra.Infrastructure, db *gorm.Driver, api *swagger.Driver) (*Provider, error) {
	ctrl := NewController(api)

	return &Provider{
		controller: ctrl,
	}, nil
}
