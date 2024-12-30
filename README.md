# YouTube Comment Finder and AI Analysis

This project is an open-source tool that allows you to search and analyze comments on YouTube videos using advanced AI capabilities. With features like sentiment analysis, trending topic identification, key point extraction, and concise comment summaries, this tool provides valuable insights into audience sentiments and interests.

## Features

- Search for comments on any YouTube video by entering the video URL.
- Filter and sort comments based on various criteria.
- Export comments to CSV or JSON format.
- Perform sentiment analysis on comments to gauge overall sentiment.
- Identify trending topics and themes within the comments.
- Extract key points and insights from the comments.
- Generate concise summaries of the comments.
- User-friendly interface for easy navigation and analysis.

## Technologies Used

- Next.js
- React
- YouTube Data API

## Getting Started

### Prerequisites

- Node.js 
- pnpm

### Installation

1. Clone the repository:

```
git clone https://github.com/AnthonyDevlop/youtube-comment-finder.git
```

2. Navigate to the project directory:

```
cd youtube-comment-finder
```

3. Install the required dependencies:

```
pnpm install
```

### Environment Variables

This project requires the following environment variables to be set:

- `CF_ACCOUNT_ID`: Your Cloudflare Account ID
- `CF_MAIL`: Your Cloudflare email address
- `CF_TOKEN`: Your Cloudflare API token
- `GOOGLE_API_KEY`: Your Google API key (for accessing the YouTube Data API)

Create a `.env` file in the project root directory and add the required environment variables:

```
CF_ACCOUNT_ID=your_cloudflare_account_id
CF_MAIL=your_cloudflare_email
CF_TOKEN=your_cloudflare_api_token
GOOGLE_API_KEY=your_google_api_key
```

### Running the Application

To start the development server, run:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [YouTube Data API](https://developers.google.com/youtube/v3)
