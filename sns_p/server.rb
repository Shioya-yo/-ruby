require 'sinatra'
require 'json'
require 'securerandom'

# publicフォルダを有効にする
set :public_folder, 'public'

# 【重要】http://localhost:4567/ にアクセスした時に index.html を開く設定
get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

def load_posts
  File.exist?('data.json') ? JSON.parse(File.read('data.json')) : []
end

def save_posts(posts)
  File.write('data.json', JSON.generate(posts))
end

get '/posts' do
  content_type :json
  load_posts.to_json
end

post '/posts' do
  body = JSON.parse(request.body.read)
  posts = load_posts
  new_post = {
    id: SecureRandom.hex(8),
    name: "Rubyエンジニア",
    handle: "@ruby_lan",
    text: body['text'],
    time: Time.now.strftime("%H:%M"),
    likes: 0
  }
  posts.unshift(new_post)
  save_posts(posts)
  status 201
end

post '/posts/:id/like' do
  posts = load_posts
  post = posts.find { |p| p['id'] == params[:id] }
  post['likes'] += 1 if post
  save_posts(posts)
  status 200
end