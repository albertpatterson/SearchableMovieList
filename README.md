# SearchableMovieList
A very basic app, used to test new technologies. It provides a searchable movie list and utilizes all parts of the full web stack. This particular version will utilize plain HTML, Node.js & Express, and DynamoDB for deployment via Elastic Beanstalk (Amazon Web Sevices/AWS). This project is intended to be very simple while utilizing all parts of the full web development stack in order to serve as a first exercise in trying a new technology. 

## Implementation
### View
- [x] single page with a title, heading, search bar, and results field
### API
- [x] matches (movies with names matching search query)
  - [x] get
### Database
- [x] single table with the movie names, with the name also service as the primary key
    -[x] version implemented in DynamoDB
    -[x] mock version implemented in JS
    
## Installation
1. Clone this repositor.
2. Create a service(/private/AWDConfigService) that provides an instance of aws-sdk with the appropriate config

    



