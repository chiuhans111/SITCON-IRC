const raw_fonts = `
:A
 ## 
#  #
####
#  #
#  #

:B 
### 
#  #
### 
#  #
### 

:C 
 ###
#  
#  
#  
 ###

:D 
### 
#  #
#  #
#  #
### 

:E
####
#  
### 
#  
####

:F
####
#  
### 
#  
#  

:G
 ###
#  
# ###
#   #
 ####

:H
#  #
#  #
####
#  #
#  #

:I
###
 # 
 # 
 # 
###

:J
####
  #
  #
# #
 # 

:K
#  #
# #
## 
# #
#  #

:L
#  
#  
#  
#  
####

:M
#   #
## ##
# # #
#   #
#   #

:N
#   #
##  #
# # #
#  ##
#   #

:O
 ###
#   #
#   #
#   #
 ### 

:P
### 
#  #
### 
#  
#

:Q
 ### 
#   #
# # #
 ###
    #

:R
### 
#  #
### 
#  #
#  #

:S
 ###
#  
 ## 
   #
### 

:T
###
 # 
 # 
 # 
 # 

:U
#  #
#  #
#  #
#  #
####

:V
# #
# #
# #
# #
 # 

:W
#   #
#   #
# # #
## ##
#   #

:X
#   #
 # #
  # 
 # #
#   #

:Y
#   #
 # #
  # 
  # 
  # 

:Z
#####
   #
  # 
 #  
#####

:#
 # #
#####
 # #
#####
 # #

:-


#####


`

import GridLogic from './GridLogic'
var Brick = GridLogic.Brick

var currentChar = ''

var fonts = {}

const w = 40
const h = 40
let y = 0

raw_fonts.split('\n').map(line => {
    // if (line.length == 0) return
    if (line.charAt(0) == ':') {
        currentChar = line.charAt(1)
        fonts[currentChar] = []
        y = 0
        return
    }
    /**@type {Array<Brick>} */
    let grid = fonts[currentChar]
    if (grid == null) return
    // let y = grid.reduce((b, a) => Math.max(a.y + a.h, b), 0)
    let x = 0
    for (let char of line) {
        if (char !== ' ') {
            grid.push(new Brick(x, y, w, h))
        }
        x += w
    }
    y += h
})

/**
 * 
 * @param {string} str 
 */
function buildString(str) {
    str = str.toUpperCase()
    let grid = []
    let x = 0

    for (let char of str) {
        if (char == ' ') {
            x += w * 3
        }
        else if (fonts[char]) {
            grid.push(...fonts[char].map(brick => {
                return brick.copy(x)
            }))
            x = grid.reduce((b, a) => Math.max(a.x + a.w, b), 0) + w
        }
        // console.log(grid)
    }

    let fw = grid.reduce((b, a) => Math.max(a.x + a.w, b), 0)
    let fh = grid.reduce((b, a) => Math.max(a.y + a.h, b), 0)

    // console.log(fw, fh)


    let s = 1200 / fw

    grid.map(brick => {
        brick.x -= fw / 2
        brick.y -= fh / 2
        brick.x *= s
        brick.y *= s
        brick.w *= s
        brick.h *= s
    })

    return grid
}

export default { fonts, buildString }