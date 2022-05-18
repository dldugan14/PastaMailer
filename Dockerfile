FROM nodejs-current
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN rm -rf node_modules package-lock.json
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 4000
CMD ["node", "index.js"]
