package account

import (
	"mingchuan.me/app/drivers/gorm"
	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/infra"
)

// Provider -
type Provider struct {
	*Service
	controller *Controller
}

// New - new account provider
func New(infra *infra.Infrastructure, db *gorm.Driver, api *swagger.Driver) (*Provider, error) {
	var err error

	srv, err := NewService(infra, db)
	if err != nil {
		return nil, err
	}

	ctrl := NewController(api, srv)

	return &Provider{
		Service:    srv,
		controller: ctrl,
	}, nil
}
