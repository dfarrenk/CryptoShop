module.exports = {
	port: process.env.PORT || 8080,
	authyAPIKey: process.env.AUTHY_API_KEY,
	mongoURL: process.env.MONGOLAB_URI || "mongodb/localhost/cryptodb"
}