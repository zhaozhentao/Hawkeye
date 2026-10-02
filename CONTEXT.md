# Context: 卓唯织针测量仪 App

## Glossary

| Term (中文) | Term (English) | Definition |
|-------------|----------------|------------|
| 出圈 | Loop Out | 织针线圈向外突出的部分，对应调节参数 chu |
| 含圈 | Loop In | 织针线圈向内包含的部分，对应调节参数 han |
| 平圈 | Flat Loop | 平整的织针线圈，对应调节参数 ping |
| 针门 | Gate | 织针通过的通道位置，对应调节参数 zhen |
| 路数 | Route | 测量通道编号，每一路对应一个织针位 |
| 三角 | Cam | 控制织针运动轨迹的机械部件 |
| 三角号 | Cam No. | 三角的编号 |
| 针门号 | Gate No. | 针门的编号 |
| 织针测量 | Needle Measure | 自动测量各织针位测量值的过程 |
| 织针调节 | Needle Adjust | 手动调整各织针位参数的编辑模式 |
| 当前值 | Current Value | 传感器实时读取的测量值（单位 mm） |
| 调机值 | Exception Value | 目标值与测量值之间的偏差 |
| 最大允许误差 | Max Tolerance | 测量值与目标值之间允许的最大偏差（红色告警阈值） |
| 最小允许误差 | Min Tolerance | 测量值与目标值之间允许的最小偏差（绿色合格阈值） |
| 组合 | Combo | 由出圈/含圈/平圈类型组成的集合 |
| 排列 | Arrangement | 组合和针门的排列顺序 |
| 配置别名 | Alias | 用户对一组组合+排列配置的自定义命名 |

### 帮助文档

**帮助文档 (Help Document)**:
帮助页面中可切换浏览的独立文档单元，每个文档有名称和内容区域。
_Avoid_: 章节、section

**文档选择器 (Document Selector)**:
帮助页面左侧的固定栏，以列表形式展示所有可用的帮助文档，选中项高亮显示。
_Avoid_: 标签页、tab、菜单

**操作说明书 (Operation Manual)**:
设备的完整操作文档，包含产品概述、安装连接、操作指南、维护保养等全部内容。

**快速入门 (Quick Start)**:
精简的安装与操作入门文档，帮助用户快速上手（内容待开发）。

**故障手册 (Troubleshooting Manual)**:
故障现象与排除方法的专项文档（内容待开发）。

**视频说明 (Video Instructions)**:
帮助页面中展示一张静态二维码图片，用户扫码后由后端 302 重定向到管理后台配置的视频地址。二维码本身固定不变，视频链接可随时通过后台更新。
_Avoid_: 视频教程、video tab、动态二维码

**技术参数表 (Technical Specifications)**:
设备各部件的技术参数汇总文档（内容待开发）。
