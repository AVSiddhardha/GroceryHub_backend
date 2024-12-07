const http = require("http");
const path = require("path");
const fs = require("fs");
const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://siddhualla2:6wYRuTCIw6vr8KCQ@groceryhub.19tvl.mongodb.net/?retryWrites=true&w=majority&appName=GroceryHub";
const client = new MongoClient(uri);

async function findsomedata(client, res){
    const cursor = client.db("GroceryHub").collection("GroceryList").find({});
    const results = await cursor.toArray();
    //console.log(results);
    //const js= (JSON.stringify(results));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(results)); // Convert the array to JSON and send it
  };

const server = http.createServer(async(req, res) => {

    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'),
                    (err, content) => {
                                    
                                    if (err) throw err;
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    res.end(content);
                        }
              );
     }

    else if (req.url==='/api')
    {
        try {
            await client.connect();
            const data = await findsomedata(client, res);
            
     
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    else{
        res.end("<h1> 404 nothing is here</h1>");
    }

});

const PORT= process.env.PORT || 5959;

server.listen(PORT,()=> console.log(`Great our server is running on port ${PORT} `));