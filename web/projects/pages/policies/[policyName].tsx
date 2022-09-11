import BaseCard from '@Components/base/base-card';
import BaseLink from '@Components/base/base-link';
import CenteredProgress from '@Components/case/centered-progress';
import ReadErrorTemplate from '@Components/case/read-error-template';
import PageContainer from '@Components/container/page-container';
import SectionContainer from '@Components/container/section-container';
import { Box } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { PageInjection } from '../_app';

const policyNames = ['privacy-policy', 'term-of-service'] as const;
type PolicyName = typeof policyNames[number];
const isPolicyName = (value: any): value is PolicyName => {
  return policyNames.includes(value);
};

const description: { [key in PolicyName]: string } = {
  'privacy-policy': `根本将治（以下「当社」といいます。）は、当社がTRECo（以下「本サービス」といいます。）を提供するにあたり、ご利用される皆様（以下「利用者」といいます。）の個人に関する情報（以下「個人情報」といいます。）を取得します。

（適用範囲）
本プライバシーポリシー（以下「本ポリシー」といいます。）は、当社が利用者から個人情報を取得、利用及び管理するときに適用されます。

（取得する情報）
当社は、利用者から以下の情報を取得します。
- 連絡先
- 情報通信端末の機体識別に関する情報
- 位置情報
- IPアドレス
- 閲覧したURL及び日時に関するタイムスタンプ

（利用目的）
当社が個人情報を収集・利用する目的は、以下のとおりです。
- 本サービスの提供・運営のため
- 広告効果の分析、市場分析、マーケティングのため
- 不正アクセス、不正利用の防止のため
- 本サービスその他のコンテンツの開発・改善のため
- 上記の利用目的に付随する目的

（Cookieの利用）
当社は、ウェブサイト及び本サービス（以下、これらを総称して「ウェブサイト等」といいます。）のアクセス及び利用状況の分析、広告配信並びにウェブサイト等の利便性向上のために、ウェブサイト等にアクセスした利用者の情報通信端末に保存されるCookie等のファイル及びこれに類似する技術を取得することがあります。当社は、Cookie等と利用者の個人情報を関連付けることがあります。当社は、利用者の個人情報と関連付けたCookie等が利用者の個人情報であることに鑑み、当該Cookie等を本個人情報保護方針の定めに従って管理いたします。また、当社は、Cookie等の情報を第三者が運営するデータ・マネジメント・プラットフォームに提供し、当該第三者からCookie等により収集されたウェブの閲覧履歴及びその分析結果を取得し、これらを利用者の個人データと結び付けた上で、広告配信等の目的で利用することがあります。

（安全確保の措置）
当社は、収集した情報の漏えい、滅失又はき損の防止その他収集した情報の適切な管理のために必要な措置を講じます。当社が、安全管理のために講じた措置の概要は以下のとおりです。措置の具体的内容については、本ポリシーで定める窓口に対する利用者からの求めに応じて遅滞なく回答いたします。

（個人情報の第三者への提供）
当社は、次に掲げる場合を除いて、あらかじめ利用者の同意を得ないで、取得した個人情報を第三者に提供することはありません。
- 法令に基づく場合
- 人の生命、身体又は財産の保護のために必要がある場合であって、利用者の同意を得ることが困難であるとき。
- 公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、利用者の同意を得ることが困難であるとき。
- 国の機関若しくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、利用者の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき。
- 前項の定めにかかわらず、次に掲げる場合には、当該個人情報の提供先は第三者に該当しないものとします。
- 当社が利用目的の達成に必要な範囲内において個人情報の取扱いの全部又は一部を委託することに伴って当該個人情報が提供される場合
- 合併その他の事由による事業の承継に伴って個人情報が提供される場合

（個人情報の共同利用）
当社は、特定の者との間で共同利用することを目的として個人情報を当該特定の者に提供することがあります。この場合、当社は、あらかじめ、共同して利用する個人情報の項目、共同して利用する者の範囲、利用する者の利用目的及び当該個人情報の管理について責任を有する者の氏名又は名称を公表するものとします。

（本プライバシーポリシーの変更）
当社は、法令改正への対応の必要性及び事業上の必要性に応じて、本ポリシーを変更する場合があります。本ポリシーの変更を行った場合には、本ウェブサイト上に掲載します。

（開示、訂正等の手続）
利用者は、本条に従って、当社に対し以下の求め又は請求を行うことができます。
- 利用者から個人情報の利用目的の通知の求め
- 利用者の個人情報の開示の請求
- 当社が保有する利用者の個人情報の内容が事実でない場合における、当該内容の訂正、追加又は削除の請求
- 利用者の個人情報が利用者に対して通知若しくは公表した利用目的の達成に必要な範囲を超えて取り扱われた場合又は当該個人情報が偽りその他不正の手段によって取得された場合における、当該個人情報の利用の停止又は消去の請求
- 利用者の個人情報が個人情報保護法第23条第1項又は第24条の規定に違反して第三者に提供されている場合における、当該個人情報の第三者への提供の停止の請求
- 前項の求め又は請求にあたっては、同項各号のうちいずれの請求か特定の上、本人確認のための書類（運転免許証、健康保険証、住民票の写し等）をご提出頂きます。
- 第1項第1号の求め又は第2号の請求については、1件につき、1,000円の手数料をご負担頂きますのであらかじめご了承ください。

（お問い合わせ）
当社の個人情報の取扱いに関するご相談や苦情等のお問い合わせについては、下記の窓口にご連絡ください。
個人情報取扱事業者：根本将治
Eメールアドレス： nemoto.masaharu.it@gmail.com
Twitter: https://twitter.com/harusame0616`,
  'term-of-service': `本規約は、根本将治（以下「当社」といいます。）が提供する「TRECo」（以下「本サービス」といいます。）を利用される際に適用されます。ご利用にあたっては、本規約をお読みいただき、内容をご承諾の上でご利用ください。

（規約の適用）
本規約は、当社が本サービスを提供する上で、利用者が本サービスの提供を受けるにあたっての諸条件を定めたものです。
当社は、本サービスの提供に関して、本規約のほか、本サービスの利用に関する個別規約その他のガイドライン等を定めることがあります。この場合、当該個別規約その他のガイドライン等は、本規約の一部として利用者による本サービスの利用に適用されるものとします。
利用者が本サービスを利用された場合、利用者が本規約に同意したものとみなします。
利用者が、未成年の場合、利用者は、本サービスの利用について、親権者等法定代理人の同意を得なければなりません。当社は、未成年者の利用者による本サービスの利用については、親権者等法定代理人の同意を得て行為されたものとみなします。

（利用登録）
利用者は、当社が定める方法により必要事項を登録いただくことで、利用登録を行うことができます。
利用者は、登録事項について、当社に対して正確かつ最新の情報を届け出なければなりません。
登録内容に変更が生じた場合、利用者は、速やかに、変更内容を当社に届け出るものとします。
登録内容が不正確若しくは虚偽であり、又は、変更内容について届出がされていないために、利用者が損害又は不利益を被ったとしても、当社は責任を負わないものとします。

（ID及びパスワードの管理）
利用者は、ID及びパスワードを厳重に管理し、保管するものとし、これを第三者に貸与、譲渡、売買その他の方法をもって利用させてはならないものとします。ID又はパスワードの管理が不十分なことにより、利用者が損害又は不利益を被ったとしても、当社は責任を負わないものとします。
ID又はパスワードを紛失又は忘失した場合、又はこれらが第三者に使用されていることが判明した場合、利用者は、直ちにその旨を当社に通知するものとします。
当社は、利用者に発行したID及びパスワードによる本サービスの利用の一切につき、利用者による真正な利用か否かにかかわらず、利用者本人の行為とみなすものとし、利用者は当該行為の結果生じる一切の責任を負担するものとします。

（知的財産権及びコンテンツ）
本サービスを構成する全ての素材に関する著作権を含む知的財産権その他の一切の権利は、当社又は当該権利を有する第三者に帰属しています。利用者は、本サービスの全ての素材に関して、一切の権利を取得することはないものとし、権利者の許可なく、素材に関する権利を侵害する一切の行為をしてはならないものとします。本規約に基づく本サービスの利用の許諾は、本サービスに関する当社又は当該権利を有する第三者の権利の使用許諾を意味するものではありません。

（サービスの内容の変更、追加、停止）
当社は、利用者に事前の通知をすることなく、本サービスの内容の全部又は一部を変更、追加又は停止する場合があり、利用者はこれをあらかじめ承諾するものとします。

（個人情報）
当社は、利用者による本サービスの利用によって取得する個人情報を、当社のプライバシーポリシーに従い、適切に取り扱います。

（禁止事項）
利用者は、次の行為を行うことはできません。
- 本サービスの運営を妨げ、又はそのおそれのある行為
- 他の利用者による本サービスの利用を妨害する行為
- 本サービスにかかる著作権その他の権利を侵害する行為
- 当社、他の利用者又は第三者の権利又は利益（名誉権、プライバシー権及び著作権を含みますが、これらに限られません。）を侵害する行為
- 公序良俗その他法令に違反する行為及びこれに違反する恐れのある行為
- 本規約に違反する行為
- 前各号の他、本サービスの趣旨に鑑みて当社が不適切と判断する行為
利用者が前項に定める行為を行ったと当社が判断した場合、当社は、利用者に事前に通知することなく、本サービスの全部又は一部の利用停止その他当社が必要かつ適切と判断する措置を講じることができます。本項の措置により利用者に生じる損害又は不利益について、当社は、一切の責任を負わないものとします。

（反社会的勢力の排除）
利用者は、当社に対し、次の事項を確約します。
自らが、暴力団、暴力団関係企業、総会屋若しくはこれらに準ずる者又はその構成員（以下総称して「反社会的勢力」といいます。）ではないこと。
自らの役員（業務を執行する社員、取締役、執行役又はこれらに準ずる者をいいます。）が反社会的勢力ではないこと。
反社会的勢力に自己の名義を利用させ、本契約を締結するものでないこと。
自ら又は第三者を利用して、次の行為をしないこと。
- 相手方に対する脅迫的な言動又は暴力を用いる行為
- 法的な責任を超えた不当な要求行為
- 偽計又は威力を用いて相手方の業務を妨害し、又は信用を毀損する行為

（免責事項）
- 天災地変、戦争、テロ行為、暴動、労働争議、伝染病、法令の制定改廃、政府機関の介入その他不可抗力により、本サービスの全部又は一部の停止、中断、遅延が発生した場合、当社は、利用者に生じた損害又は不利益について一切責任を負いません。
- 利用者は、通信回線やコンピュータの障害、システムメンテナンスその他の事由による本サービスの全部又は一部の停止、中断、遅延が起こり得ることを理解しているものとし、当社は、これらにより利用者に生じた損害又は不利益について一切責任を負いません。また、利用者の利用環境によって生じた損害又は不利益について、当社は一切責任を負いません。
- 当社は、以下の掲げる事項について、明示的にも黙示的にも保証しません。
- 本サービスの内容及び本サービスを通じて提供される情報の、有用性、完全性、正確性、最新性、信頼性、特定目的への適合性。
- 本サービスで提供される情報が第三者の権利を侵害しないものであること。
- 本サービスが将来にわたって存続し続けること
当社は、利用者による本サービスの利用に関連して、利用者に対して責任を負う場合には、該当の商品等の価額を超えて賠償する責任を負わないものとし、また、付随的損害、間接損害、特別損害、将来の損害および逸失利益にかかる損害については、賠償する責任を負わないものとします。

（秘密保持）
本利用者は、本サービスの利用にあたり、当事務所より開示を受け、又は知り得た一切の情報について、第三者に開示又は漏えいしてはならず、本サービスの利用以外の目的に使用してはなりません。

（当社からの通知）
当社から利用者に対して通知を行う場合、利用者が登録した電子メールアドレス宛に電子メールを送信する方法、本サービスに係るウェブサイト上への掲示その他当社が適当と判断する方法により行うものとします。
当社が通知を行う場合において、前項の電子メールアドレス宛に送信した場合、当該電子メールアドレスのメールサーバーに記録された時点で、当社の通知は利用者に到達したものとみなします。
利用者は、第1項の電子メールアドレスに変更がある場合、速やかに当社に通知するものとします。本項の変更の通知を受けるまでに当社が変更前の電子メールアドレス宛に送信した通知は、その発信の時点で利用者に到達したものとみなします。
利用者が前項に定める通知を怠ったことにより、利用者に損害又は不利益が生じたとしても、当社は何らの責任を負いません。

（第三者との紛争）
本サービスに関連して利用者と第三者間で発生した紛争については、利用者は自らの費用と責任で解決するものとし、当社は一切の責任を負わないものとします。
前項に関し、当社が損害（弁護士費用を含みます。）を被った場合、利用者は当該損害を賠償するものとします。

（権利義務の譲渡禁止）
利用者は、本規約に基づく契約上の地位及びこれにより生じる権利義務の全部または一部について、当社の書面による事前の承諾なく、第三者に対し、譲渡、移転、担保権の設定その他の処分をすることができません。

（分離可能性）
本規約のいずれかの条項が利用者との本規約に基づく契約に適用される法令に違反し、無効とされる場合、当該条項は、その違反とされる限りにおいて、当該利用者との契約には適用されないものとします。この場合でも、本規約の他の条項の効力には影響しません。

（本規約の変更）
当社は、本規約を変更する必要が生じた場合には、民法第548条の4（定型約款の変更）に基づき、本規約を変更することができます。本規約を変更する場合、当社は、その効力発生日を定め、効力発生日までに、電子メールの送信その他の方法により以下の事項を周知するものとします。
- 本規約を変更する旨
- 変更後の本規約の内容
- 効力発生日

（準拠法、裁判管轄）
本規約は、日本法に準拠して解釈されます。
当社及び利用者は、本サービスに関し、当社と利用者との間で生じた紛争の解決について、水戸地方裁判所を第一審の専属的合意管轄裁判所とすることにあらかじめ合意します。 `,
};

const title: { [key in PolicyName]: string } = {
  'privacy-policy': 'プライバシーポリシー',
  'term-of-service': '利用規約',
};

const PrivacyPage: NextPage<PageInjection> = ({ pageTitle }) => {
  const router = useRouter();
  const policyName = router.query.policyName as string;
  console.log(router.query.policyName);

  useEffect(() => {
    if (isPolicyName(policyName)) {
      pageTitle.setTitle(title[policyName]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  if (!isPolicyName(policyName)) {
    return <ReadErrorTemplate />;
  }

  return (
    <PageContainer>
      <SectionContainer flexGrow={1}>
        <Box flexGrow={1} height={0}>
          <BaseCard height="100%">
            <Box
              sx={{
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
                overflow: 'scroll',
              }}
              height="100%"
            >
              {description[policyName]}
            </Box>
          </BaseCard>
        </Box>
      </SectionContainer>
      <SectionContainer center>
        <BaseLink href="/">戻る</BaseLink>
      </SectionContainer>
    </PageContainer>
  );
};

export default PrivacyPage;
