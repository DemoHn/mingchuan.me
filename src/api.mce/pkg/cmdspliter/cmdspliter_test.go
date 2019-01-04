package cmdspliter

import (
	"testing"
	// goblin
	. "github.com/franela/goblin"
)

func Test_Utils(t *testing.T) {
	g := Goblin(t)

	g.Describe("Utils: splitCommand()", func() {
		g.It("should pass all tests", func() {
			testcases := []string{
				"",
				"asdf",
				"asdf/java s q r",
				// double quote
				"asdf/java s q r \"fr om \" d",
				// single quote
				"asdf/java s q r 'fr om ' d",
				// single quote with multiple spaces
				"'java script'                 -i          good    ",
				// double quote contains single quote
				"hello \"it's time to change\"",
				// trx spaces
				"Program\\ Files\\\\ husman",
				// trx single quotes
				"\"Program \" \"with\" husman",
			}

			expectPrograms := []string{
				"",
				"asdf",
				"asdf/java",
				"asdf/java",
				"asdf/java",
				"java script",
				"hello",
				"Program Files\\",
				"Program ",
			}

			expectArgs := [][]string{
				[]string{},
				[]string{},
				[]string{"s", "q", "r"},
				[]string{"s", "q", "r", "fr om ", "d"},
				[]string{"s", "q", "r", "fr om ", "d"},
				[]string{"-i", "good"},
				[]string{"it's time to change"},
				[]string{"husman"},
				[]string{"with", "husman"},
			}

			for i, s := range testcases {
				program, args := SplitCommand(s)
				g.Assert(program).Equal(expectPrograms[i])
				g.Assert(args).Equal(expectArgs[i])
			}
		})
	})
}
