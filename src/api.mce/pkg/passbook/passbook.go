package passbook

import (
	"crypto/rand"
	"fmt"
	"io/ioutil"
	"os"
)

// PassBook - type passbook
type PassBook struct {
	blocks     uint16
	loadData   []byte
	exportData []byte
}

// NewPassBook -
func NewPassBook(blocks uint16) *PassBook {
	return &PassBook{
		blocks: blocks,
	}
}

// getters
// GetLoadData -
func (book *PassBook) GetLoadData() []byte {
	return book.loadData
}

// GetExportData -
func (book *PassBook) GetExportData() []byte {
	return book.exportData
}

// LoadFromFile - load data from file
func (book *PassBook) LoadFromFile(file string) error {
	f, err := os.Open(file)
	if err != nil {
		return err
	}
	defer f.Close()

	b, err2 := ioutil.ReadAll(f)
	if err2 != nil {
		return err2
	}

	book.loadData = b
	return nil
}

// LoadFromData - load data from byte array
func (book *PassBook) LoadFromData(data []byte) error {
	book.loadData = data
	return nil
}

// Generate - generate an series of bytes as a new passbook
func (book *PassBook) Generate() {
	var index uint16
	// clear previous
	book.exportData = book.exportData[:0]
	for index = 0; index < book.blocks; index++ {
		book.exportData = append(book.exportData, generateBlock()...)
	}
}

// Export - export (generated, not loaded) passbook data to file
func (book *PassBook) Export(file string) error {
	f, err := os.OpenFile(file, os.O_RDWR|os.O_CREATE, 0755)
	if err != nil {
		return err
	}
	defer f.Close()

	_, errWrite := f.Write(book.exportData)
	if errWrite != nil {
		return errWrite
	}

	return nil
}

// Encrypt - encrypt data from vector
func (book *PassBook) Encrypt(vector []byte, reverse bool) ([]byte, error) {
	var index int
	var result = make([]byte, 0)
	if len(book.loadData) < int(book.blocks*256) {
		return nil, fmt.Errorf("loadData length not enough")
	}

	// do reading
	for index = 0; index < int(book.blocks); index++ {
		fixedPoint := 0
		findFixedPoint := false
		for j := 0; j < 256; j++ {
			i := int(index*256) + j
			if book.loadData[i] == byte(j) {
				findFixedPoint = true
				fixedPoint = j
				break
			}
		}

		if findFixedPoint == false {
			return nil, fmt.Errorf("Invalid or corrupted data")
		}

		coor := 0
		newX := index*256 + int(vector[index])
		v := int(book.loadData[newX])
		if reverse == true {
			coor = (fixedPoint - v + 256) % 256
		} else {
			coor = (fixedPoint + v) % 256
		}

		result = append(result, book.loadData[index*256+coor])
	}

	return result, nil
}

// internal function
func generateBlock() []byte {
	repeat := true
	block := make([]byte, 256)
	for repeat == true {
		rand.Read(block)

		for j := 0; j < 256; j++ {
			if block[j] == byte(j) {
				repeat = false
				break
			}
		}
	}
	return block
}
