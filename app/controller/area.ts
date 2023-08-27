import { Controller } from 'egg';
import { Op } from 'sequelize';

/**
 * @controller Area 区域
 */
export default class AreaController extends Controller {
  /**
   * @summary 获取全部区域列表，包含省市区县
   * @description
   * @router POST /area/getAllAreas
   * @response 200 getAreasResponse 返回全部区域信息
   */
  async getAllAreas() {
    const { ctx } = this;
    const data = await ctx.model.BaseArea.findAll();
    ctx.success(data);
  }

  /**
   * @summary 根据区域ID获取区域信息，支持多个
   * @description
   * @router POST /area/getAreas
   * @request body getAreasRequest *body
   * @response 200 getAreasResponse 返回区域列表
   */
  async getAreas() {
    const { ctx } = this;

    ctx.validate(ctx.rule.getAreasRequest);

    const { areaIds } = ctx.request.body;
    const data = await ctx.model.BaseArea.findAll({
      where: { id: { [Op.in]: areaIds } },
    });
    ctx.success(data);
  }

  /**
   * @summary 根据区域ID获取区域下的子区域
   * @description
   * @router POST /area/getSubAreas
   * @request body getSubAreasRequest *body
   * @response 200 getAreasResponse 返回区域列表
   */
  async getSubAreas() {
    const { ctx } = this;

    ctx.validate(ctx.rule.getSubAreasRequest);

    const { areaId } = ctx.request.body;
    const data = await ctx.model.BaseArea.findAll({
      where: { pid: areaId },
    });
    ctx.success(data);
  }
}
