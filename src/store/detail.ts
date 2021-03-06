import { action, observable } from 'mobx';
import moment from 'moment';
import { httpGet } from '../common/request';
import { ReplyModel } from '../models/reply';
import { TopicModel } from '../models/topic';
import { UserModel } from '../models/user';
import { setDocumentTitle } from '../common/utils';

export interface TopicDetail extends TopicModel {
  author?: UserModel;
}

export interface ReplyDetail extends ReplyModel {
  author_avatar?: string;
  author_id: number;
  author_nick_name: string;
}

class Store {
  @observable
  topic: TopicDetail = {};

  @observable
  replies: ReplyDetail[] = [];

  @action
  async load(id: string | number) {
    const topic: TopicDetail = await httpGet(`/api/topic/detail/${id}`, {});
    topic.created_at = moment(topic.created_at).fromNow();
    setDocumentTitle(topic.title);
    const { list } = await httpGet(`/api/reply/list/${id}`);
    this.replies = (list as ReplyDetail[]).map(reply => ({
      ...reply,
      created_at: moment(reply.created_at).fromNow(),
    }));
    this.topic = topic;
  }
}

const detailStore = new Store();
export default detailStore;
