# Copyright 2022 chenzhiqiang
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# build stage
FROM node:10 as build-stage

LABEL maintainer=522864794@qq.com

# 创建一个工作区
WORKDIR /app

# 复制项目文件资源到镜像中,但是有些文件是我们不想要的必入 node_module，这时候需要在配置一个dockerignore文件
COPY . .
RUN yarn install --registry=https://registry.npm.taobao.org
# 这里就产生了dist目录
RUN npm run build

EXPOSE 12005
VOLUME ["/app/public"]
CMD ["node", "dist/main.bundle.js"]