# **DEML Official codding style :**

****
## **1 - File naming :**

The names of your file should always describe what your embed is use for. The name of the file should be entierly lower case and spaces should be replaced by underscores. For exemple, the file of an embed used to greets a new user on a guild should be :
```
greeting.deml
```
and not
```
greeting_embed.deml
Greeting.deml
gReeting.deml
rhbilexvpievuipbejpmbv.deml
```
If for whatever reason you need more than one embed for the same function, index the files like so :
```
my_embed_0.deml
my_embed_1.deml
my_embed_2.deml
...
```

****
## **2 - Indentation :**

For every tag content you should indent the inside text and tags with 4 spaces or one tabulation like so :

```html
<embed>
    Embed Content
    <div>
        Div content
    </div>
</embed>
```

For tags with short contents (like titles or footer) you should put a space before and after the text like so :
```html
<title> My Title </title>
```
****
## **3 - Comments :**

You should indent your comments at the same indentation as the code you want to comment, and at the line just before it, like so :
```html
<embed>

    ## Here I comment my meta
    <meta color= "#fff"/>
    
    ## Here I comment my div
    <div>
        ## Here I comment my div content
        My div content
    </div>
</embed>
```

You should also comment the blank lines between two commented lines, and leave a blank line between a tag and a new comment.
```html
## Here the start of may comment
##
## But I aslo comment here
<meta url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"/>

## Here I can continue commenting
```
