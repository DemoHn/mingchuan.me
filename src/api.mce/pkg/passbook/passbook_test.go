package passbook

import (
	"io/ioutil"
	"os"
	"testing"
	// goblin
	. "github.com/franela/goblin"
)

func Test_PassBook(t *testing.T) {
	g := Goblin(t)
	book := NewPassBook(8)
	g.Describe("PassBook", func() {
		g.It("could load data from file", func() {
			data := []byte{0x01, 0x02, 0x03}
			ioutil.WriteFile("test.file", data, 0755)
			defer os.Remove("test.file")

			err := book.LoadFromFile("test.file")
			g.Assert(err).Equal(nil)
			// data has been loaded
			g.Assert(book.GetLoadData()).Equal(data)
		})

		g.It("could laod data from data", func() {
			data := []byte{0x01, 0x02, 0x03, 0x04, 0x05}

			err := book.LoadFromData(data)
			g.Assert(err).Equal(nil)
			// data has been loaded
			g.Assert(book.GetLoadData()).Equal(data)
		})

		g.It("should generate 256 * 8 of random data", func() {
			book.Generate()
			data1 := book.GetExportData()
			g.Assert(len(data1)).Equal(256 * 8)

			// again
			book.Generate()
			data2 := book.GetExportData()
			g.Assert(len(data2)).Equal(256 * 8)
		})

		g.It("should encrypt with different results when vendor differs", func() {
			vector1 := []byte{0x02, 0x04, 0x06, 0x08, 0x10, 0x12, 0x14, 0x16}
			vector2 := []byte{0x22, 0x34, 0x46, 0x58, 0x60, 0x72, 0x84, 0x96}

			book.Generate()
			export := book.GetExportData()
			book.LoadFromData(export)
			data1, err1 := book.Encrypt(vector1, false)
			g.Assert(err1).Equal(nil)
			g.Assert(len(data1)).Equal(len(vector1))

			data2, err2 := book.Encrypt(vector2, false)
			g.Assert(err2).Equal(nil)
			g.Assert(len(data2)).Equal(len(vector2))

			diff := true
			for k, v := range data1 {
				if data2[k] != v {
					diff = false
					break
				}
			}
			g.Assert(diff).Equal(false)
		})

		g.It("should return different data when reverse differs", func() {
			vector1 := []byte{0x02, 0x04, 0x06, 0x08, 0x10, 0x12, 0x14, 0x16}

			book.Generate()
			export := book.GetExportData()
			book.LoadFromData(export)
			data1, err1 := book.Encrypt(vector1, false)
			g.Assert(err1).Equal(nil)
			g.Assert(len(data1)).Equal(len(vector1))

			data2, err2 := book.Encrypt(vector1, true)
			g.Assert(err2).Equal(nil)
			g.Assert(len(data2)).Equal(len(vector1))

			diff := true
			for k, v := range data1 {
				if data2[k] != v {
					diff = false
					break
				}
			}
			g.Assert(diff).Equal(false)
		})

		g.It("should export data to file", func() {
			book.Generate()

			e := book.Export("test.file2")
			defer os.Remove("test.file2")
			g.Assert(e).Equal(nil)

			data, _ := ioutil.ReadFile("test.file2")
			g.Assert(len(data)).Equal(256 * 8)

		})
	})
}
