require 'sinatra'
require 'json'
require 'securerandom'

set :public_folder, 'public'

def load_posts; File.exist?('data.json') ? JSON.parse(File.read('data.json')) : []; end
def save_posts(posts); File.write('data.json', JSON.generate(posts)); end

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
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
    name: body['name'],
    avatar: body['avatar'],
    text: body['text'],
    postImage: body['postImage'],
    time: Time.now.strftime("%H:%M")
  }
  posts.unshift(new_post)
  save_posts(posts)
  status 201
end

delete '/posts/:id' do
  posts = load_posts
  posts.reject! { |p| p['id'] == params[:id] }
  save_posts(posts)
  status 200
end
