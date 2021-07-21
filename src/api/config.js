import axios from 'axios';

export const baseUrl = 'http://192.168.102.13:5400';

const axiosInstance = axios.create({
  baseURL: baseUrl
})

axiosInstance.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err, '网络错误');
    return Promise.reject(err)
  }
)

export {
  axiosInstance
}

// 歌手种类
export const categoryTypes = [{
  name: "华语男",
  key: '1.7'
},
{
  name: "华语女",
  key: '2.7'
},
{
  name: "华语组合",
  key: '3.7'
},
{
  name: "欧美男",
  key: '1.96'
},
{
  name: "欧美女",
  key: '2.96'
},
{
  name: "欧美组合",
  key: '3.96'
},
{
  name: "日本男",
  key: '1.8'
},
{
  name: "日本女",
  key: '2.8'
},
{
  name: "日本组合",
  key: '3.8'
},
{
  name: "韩国男",
  key: '1.16'
},
{
  name: "韩国女",
  key: '2.16'
},
{
  name: "韩国组合",
  key: '3.16'
},
{
  name: "其他男歌手",
  key: '1.0'
},
{
  name: "其他女歌手",
  key: '2.0'
},
{
  name: "其他组合",
  key: '3.0'
},
];

// 歌手首字母
export const alphaTypes = [{
    key: "A",
    name: "A"
  },
  {
    key: "B",
    name: "B"
  },
  {
    key: "C",
    name: "C"
  },
  {
    key: "D",
    name: "D"
  },
  {
    key: "E",
    name: "E"
  },
  {
    key: "F",
    name: "F"
  },
  {
    key: "G",
    name: "G"
  },
  {
    key: "H",
    name: "H"
  },
  {
    key: "I",
    name: "I"
  },
  {
    key: "J",
    name: "J"
  },
  {
    key: "K",
    name: "K"
  },
  {
    key: "L",
    name: "L"
  },
  {
    key: "M",
    name: "M"
  },
  {
    key: "N",
    name: "N"
  },
  {
    key: "O",
    name: "O"
  },
  {
    key: "P",
    name: "P"
  },
  {
    key: "Q",
    name: "Q"
  },
  {
    key: "R",
    name: "R"
  },
  {
    key: "S",
    name: "S"
  },
  {
    key: "T",
    name: "T"
  },
  {
    key: "U",
    name: "U"
  },
  {
    key: "V",
    name: "V"
  },
  {
    key: "W",
    name: "W"
  },
  {
    key: "X",
    name: "X"
  },
  {
    key: "Y",
    name: "Y"
  },
  {
    key: "Z",
    name: "Z"
  }
];