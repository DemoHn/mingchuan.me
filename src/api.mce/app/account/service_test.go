package account

import (
	"testing"

	// goblin
	. "github.com/franela/goblin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func Test_AccountService(t *testing.T) {
	g := Goblin(t)

	var acct *AccountService
	var db *gorm.DB

	g.Describe("Service: Account", func() {
		g.Before(func() {
			db, _ = gorm.Open("sqlite3", ":memory:")
			acct = NewService(db, "DIU")

			g.Assert(acct.Init()).Eql(nil)
		})

		g.Describe("create & verify password", func() {
			g.It("should generate password successfully", func() {
				_, err := acct.RegisterAndSign("hello", "password", true)
				g.Assert(err).Equal(nil)
				// TODO: more test asserts
			})
		})
	})

}
