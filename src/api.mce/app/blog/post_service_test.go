package blog

import (
	"fmt"
	"testing"
	"time"

	// goblin
	. "github.com/franela/goblin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func Test_Articles(t *testing.T) {
	g := Goblin(t)
	g.Describe("Service: Blog", func() {

		var blog *BlogService
		var db *gorm.DB

		g.Before(func() {
			db, _ = gorm.Open("sqlite3", ":memory:")
			blog = NewService(db)

			g.Assert(blog.Init()).Eql(nil)
		})

		g.Describe("Article()", func() {
			g.It("should create an article", func() {
				var expTitle = "EXAMPLE TITLE"
				var expContent = "example content"
				var expStatus = Published
				var expPermission = Private
				newPost, err := blog.CreatePost(expTitle, expContent, expStatus, expPermission)
				g.Assert(err == nil).Equal(true)

				var expArticle Article
				err2 := db.Find(&expArticle, "id = ?", 1).Error
				g.Assert(err2).Equal(nil)

				// check actual data in db
				g.Assert(expTitle).Equal(expArticle.Title)
				g.Assert(expContent).Equal(expArticle.Content)
				g.Assert(expPermission).Equal(expArticle.Permission)
				g.Assert(expStatus).Equal(expArticle.Status)

				// find event log
				var expLog ArticleEventLog
				err3 := db.Find(&expLog, "id = ?", newPost.ID).Error
				g.Assert(err3).Equal(nil)

				g.Assert(expLog.ArticleID).Equal(uint32(1))
				g.Assert(expLog.ArticleEvent).Equal(PublishPost)
				g.Assert(expLog.NewStatus).Equal(Published)
				g.Assert(expLog.NewPermission).Equal(Private)
			})

			g.It("should create article failed /validation error", func() {
				// set validation to a known value
				var oldValidation = blog.Validations
				blog.SetValidations(BlogValidations{
					MaxTitleChars:   5,
					MaxArticleChars: 10,
				})

				// vialation 1# size too long
				_, err1 := blog.CreatePost("LONG_TITLE", "233", Published, Private)
				g.Assert(err1 != nil).Equal(true)
				// 1.1
				_, err11 := blog.CreatePost("", "233", Published, Private)
				g.Assert(err11 != nil).Equal(true)
				// 2
				_, err2 := blog.CreatePost("f", "HAS_A_ANOTHER_LONG_TIME", Published, Private)
				g.Assert(err2 != nil).Equal(true)
				// 3
				_, err3 := blog.CreatePost("f", "g", Removed, Private)
				g.Assert(err3 != nil).Equal(true)

				blog.SetValidations(oldValidation)
			})

			g.It("should delete post", func() {
				// create another new post
				newPost, errC := blog.CreatePost("T", "G", Published, Private)
				g.Assert(errC == nil).Equal(true)

				// get ID
				errD := blog.DeletePost(newPost.ID)
				g.Assert(errD == nil).Equal(true)

				// find post
				var delPost Article
				errF := db.Find(&delPost, "id = ?", newPost.ID).Error
				g.Assert(errF == nil).Equal(true)
				// Notice: It's not actually deleted from DB
				// Just make the status as "Removed"
				g.Assert(delPost.Status).Equal(Removed)

				// TODO: add event
			})

			g.It("should publish a drafted post", func() {
				newPost, errC := blog.CreatePost("T", "R", Drafted, Private)
				g.Assert(errC == nil).Equal(true)

				// getID
				_, errD := blog.PublishPost(newPost.ID)
				g.Assert(errD == nil).Equal(true)

				// find post
				var pubPost Article
				errF := db.Find(&pubPost, "id = ?", newPost.ID).Error
				g.Assert(errF == nil).Eql(true)
				g.Assert(pubPost.Status).Eql(Published)
			})

			g.It("should throw error on publish a non-draft post", func() {
				newPost, errC := blog.CreatePost("T", "R", Published, Private)
				// throw error because it has already published
				g.Assert(errC == nil).Equal(true)

				// publish post
				_, errD := blog.PublishPost(newPost.ID)
				g.Assert(errD == nil).Eql(false)
			})

			g.It("should find all posts with newly created", func() {
				errDA := db.Delete(Article{}).Error
				g.Assert(errDA == nil).Eql(true)

				for i := range []int{1, 2, 3} {
					blog.CreatePost(string(i), "B", Published, Private)
				}

				_, articles, errL := blog.ListAllPostsByPage(nil, nil)
				g.Assert(errL == nil).Eql(true)
				g.Assert(len(articles)).Equal(3)
			})

			g.It("should get one post", func() {
				newPost, errC := blog.CreatePost("R", "S", Published, Public)
				g.Assert(errC == nil).Eql(true)

				post, errG := blog.GetOnePost(newPost.ID)
				g.Assert(errG == nil).Eql(true)
				g.Assert(post.ID).Eql(newPost.ID)
				g.Assert(post.Status).Equal(newPost.Status)
				g.Assert(post.CreatedAt.UnixNano()).Equal(newPost.CreatedAt.UnixNano())
			})
		})

		g.Describe("Get Articles by Filter", func() {
			g.Before(func() {
				// clear all data
				db.Exec("delete from articles")
				// insert fixtures
				p := Public
				s := Published
				for i := 0; i < 12; i++ {
					// so there will be 6 private posts
					if i%2 == 0 {
						p = Private
					}
					switch i % 3 {
					case 0:
						s = Published
					case 1:
						s = Drafted
					case 2:
					default:
						s = Removed
					}
					db.Create(&Article{
						Title:      fmt.Sprintf("Title-%d", i),
						Content:    "content",
						Permission: p,
						Status:     s,
					})
					time.Sleep(10 * time.Millisecond)
				}
			})

			g.After(func() {
				db.Exec("delete from articles")
			})

			g.It("should load all posts", func() {
				db := blog.DB
				posts, err := listPostsWithFilters(db, nil, nil, nil)
				g.Assert(err == nil).Equal(true)
				g.Assert(len(posts)).Equal(12)
			})

			g.It("should work /status = PUBLISHED", func() {
				db := blog.DB
				p := Published
				filter := ArticleFilter{
					Status:     &p,
					Permission: nil,
				}

				posts, err := listPostsWithFilters(db, &filter, nil, nil)
				g.Assert(err == nil).Eql(true)
				g.Assert(len(posts)).Eql(4)
			})

			g.It("should work /limit = 2", func() {
				filter := ArticlePageLimit{
					Offset: 0,
					Limit:  2,
				}

				posts, err := listPostsWithFilters(db, nil, &filter, nil)
				g.Assert(err == nil).Eql(true)
				g.Assert(len(posts)).Eql(2)
			})

			g.It("should work /offset = 7", func() {
				filter := ArticlePageLimit{
					Offset: 7,
					Limit:  10,
				}

				posts, err := listPostsWithFilters(db, nil, &filter, nil)
				g.Assert(err == nil).Eql(true)
				g.Assert(len(posts)).Eql(5)
			})

			g.It("should work /createdAt desc", func() {
				s := "desc"
				filter := ArticleOrder{
					UpdatedAt: nil,
					CreatedAt: &s,
				}

				posts, err := listPostsWithFilters(db, nil, nil, &filter)
				g.Assert(err == nil).Eql(true)
				g.Assert(len(posts)).Equal(12)

				lastPost := posts[0]
				for i := 1; i < len(posts); i++ {
					before := posts[i].CreatedAt.Before(lastPost.CreatedAt)
					lastPost = posts[i]

					g.Assert(before).Equal(true)
				}
			})

			g.It("should work /createdAt asc", func() {
				s := "asc"
				filter := ArticleOrder{
					UpdatedAt: nil,
					CreatedAt: &s,
				}

				posts, err := listPostsWithFilters(db, nil, nil, &filter)
				g.Assert(err == nil).Eql(true)
				g.Assert(len(posts)).Equal(12)

				lastPost := posts[0]
				for i := 1; i < len(posts); i++ {
					after := posts[i].CreatedAt.After(lastPost.CreatedAt)
					lastPost = posts[i]

					g.Assert(after).Equal(true)
				}
			})

			// TODO: more testcases
		})
	})
}
