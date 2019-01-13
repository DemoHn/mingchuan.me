package gorm

import (
	"github.com/jinzhu/gorm"
	"mingchuan.me/infra"
	"mingchuan.me/util"
)

// Driver - gorm_driver is a wrapper of the popular ORM: gorm
type Driver struct {
	*gorm.DB
}

// NewDriver - new gorm driver
func NewDriver(infra *infra.Infrastructure) (*Driver, error) {
	var err error
	var db *gorm.DB
	var dbURL string

	// find dbURL first
	if dbURL, err = util.GenerateDatabaseURL(infra.Config); err != nil {
		return nil, err
	}

	// open db connection
	if db, err = gorm.Open("mysql", dbURL); err != nil {
		return nil, err
	}
	return &Driver{DB: db}, nil
}

// Close - close DB
func (d *Driver) Close() error {
	return d.DB.Close()
}
