package blog

import (
	"mingchuan.me/app/drivers/gorm"
	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/infra"
)

// Provider - blog Provider
type Provider struct {
	*PostService
}

// New - new blog provider
func New(infra *infra.Infrastructure, db *gorm.Driver, api *swagger.Driver) (*Provider, error) {
	pSrv, err := NewPostService(db)
	if err != nil {
		return nil, err
	}
	// init
	NewPostController(api, pSrv)

	return &Provider{
		PostService: pSrv,
	}, nil
}
