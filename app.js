const express =require('express');
const https= require("https");
const bodyParser=require("body-parser");
const request=require("request");

const app=express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname +"/index.html");
})

app.post("/",function(req,res){
    console.log(req.body);
   // res.send("Thanks For filling the form");

    var Fname=req.body.Fname;
    var Lname=req.body.Lname;
    var email=req.body.email;

    const url ="https://us5.api.mailchimp.com/3.0/lists/3927719a0e";

    const data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: Fname,
                    LNAME: Lname
                }
            }
        ]
    };

    const jsonData= JSON.stringify(data);

    const options={
        method: "POST",
        auth: "KartikDang:972f64bde0edec87bde0eb0bd259901f-us5"
    }
    const request=https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })

        var code=response.statusCode;
        console.log(code);

        if(code!=200)
        {
            res.sendFile(__dirname+"/failure.html");
        }

        else{
            res.sendFile(__dirname+"/success.html");
            //res.send();
        }
    });



    request.write(jsonData);

    req.on('error', function(event) {
        console.log(event);

        res.write("please try again later");
      });
    request.end();

})

app.listen(3000,function(req,res){
    console.log("Server is running on port 3000");
})

//List Id/Audience Id=3927719a0e
//Key=972f64bde0edec87bde0eb0bd259901f-us5