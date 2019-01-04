package util

import (
	// goblin

	"testing"

	. "github.com/franela/goblin"
	gomock "github.com/golang/mock/gomock"
	"mingchuan.me/mock"
)

func Test_db_url(t *testing.T) {
	g := Goblin(t)

	g.Describe("db_url", func() {
		var cfg *mock.MockIConfig
		var mockCtrl *gomock.Controller
		g.BeforeEach(func() {
			mockCtrl = gomock.NewController(t)
			cfg = mock.NewMockIConfig(mockCtrl)
		})

		g.AfterEach(func() {
			mockCtrl.Finish()
		})

		g.It("should generate db_url", func() {
			cfg.EXPECT().FindString("database.type").Return("mysql", nil)
			cfg.EXPECT().FindString("database.user").Return("user", nil)
			cfg.EXPECT().FindString("database.password").Return("password", nil)
			cfg.EXPECT().FindString("database.host").Return("localhost", nil)
			cfg.EXPECT().FindString("database.name").Return("mce", nil)
			cfg.EXPECT().FindInt("database.port").Return(3306, nil)
			cfg.EXPECT().Find("database.options").Return(nil, nil)

			url, err := GenerateDatabaseURL(cfg)
			g.Assert(url).Equal("user:password@tcp(localhost:3306)/mce")
			g.Assert(err).Equal(nil)
		})

		g.It("should generate db_url /with options", func() {
			options := map[interface{}]interface{}{
				"charset": "utf8",
				"isWORK":  "true",
			}
			cfg.EXPECT().FindString("database.type").Return("mysql", nil)
			cfg.EXPECT().FindString("database.user").Return("user", nil)
			cfg.EXPECT().FindString("database.password").Return("password", nil)
			cfg.EXPECT().FindString("database.host").Return("localhost", nil)
			cfg.EXPECT().FindString("database.name").Return("mce", nil)
			cfg.EXPECT().FindInt("database.port").Return(3306, nil)
			cfg.EXPECT().Find("database.options").Return(options, nil)

			url, err := GenerateDatabaseURL(cfg)
			g.Assert(url).Equal("user:password@tcp(localhost:3306)/mce?charset=utf8&isWORK=true")
			g.Assert(err).Equal(nil)
		})

		g.It("should fail /invalid type", func() {
			cfg.EXPECT().FindString("database.type").Return("another_type", nil)

			s, err := GenerateDatabaseURL(cfg)
			g.Assert(s).Equal("")
			g.Assert(err != nil).Equal(true)
		})
	})
}
