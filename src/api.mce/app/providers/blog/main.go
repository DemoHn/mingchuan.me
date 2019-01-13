package blog

import (
	"github.com/jinzhu/gorm"
	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/pkg/morloop"
)

const (
	BlogServiceVersion = 3
	MaxTitleChars      = 120
	MaxArticleChars    = 120000
)

type mRouter = *morloop.Router

type BlogValidations struct {
	MaxTitleChars   uint32
	MaxArticleChars uint32
}

// BlogService - blog service main data struct
type BlogService struct {
	*gorm.DB
	*PostRepo
	Version     uint16
	Validations BlogValidations
}

// NewService - new blog service object
func NewService(db *gorm.DB) *BlogService {
	return &BlogService{
		DB:       db,
		PostRepo: NewPostRepo(db),
		// Hardcore version number
		Version: BlogServiceVersion,
		// init validations
		Validations: BlogValidations{
			MaxTitleChars:   MaxTitleChars,
			MaxArticleChars: MaxArticleChars,
		},
	}
}

// Init - init service before doing any executions
func (blog *BlogService) Init() error {
	db := blog.DB
	if err1 := db.AutoMigrate(&Article{}).Error; err1 != nil {
		return err1
	}

	if err2 := db.AutoMigrate(&ArticleEventLog{}).Error; err2 != nil {
		return err2
	}
	return nil
}

// SetValidations - override default blog validation settings
func (blog *BlogService) SetValidations(validations BlogValidations) {
	blog.Validations = validations
}

// RegisterAPI -
func (blog *BlogService) RegisterAPI(api *swagger.API) {
	pCtrl := CreatePostController(api, blog)

	// admin
	pCtrl.CreatePost()
	pCtrl.GetOnePost()
	pCtrl.PublishPost()
	pCtrl.UpdatePost()
	pCtrl.DeletePost()
	pCtrl.ListAllPosts()

	// public
	pCtrl.GetOnePublicPost()
	pCtrl.ListAllPublicPosts()
}
