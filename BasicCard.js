var fs = require("fs");

module.exports = BasicCard;


function BasicCard(front, back) {
    this.front = front;
    this.back = back;
    this.create = function() {
        var data = {
            front: this.front,
            back: this.back,
            type: "basic",
        };
        
        fs.appendFile("basicquestions.txt", JSON.stringify(data) + ';', "utf8", function(error) {
            if (error) {
                console.log(error);
            }
        });
    };
}