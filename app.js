// ============================================================
// app.js · 应用逻辑（选题引擎 / 分步流水线 / 风控扫描 / 历史配方）
// 依赖 data.js 的顶层数据（stages/behaviors/painPoints/strategies/...）
// 注意：本文件保持原 IIFE 包裹，只有 window.* 导出对 HTML 内联 onclick 可见
// ============================================================

(function() {

    // 每个步骤的多版本内容（versionIdx 控制版本切换，现5个版本）
    function getStepContent(step, topic, versionIdx) {
        if (!topic) return '请先选择一个选题。';
        const { stage, behavior, pain, strategy, behaviorObj, painObj, strategyObj } = topic;
        const v = versionIdx % 5; // 0-4 五个版本循环
        // 随机选取子内容使文案更具体
        const randSub = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const bSub = behaviorObj && behaviorObj.subs ? randSub(behaviorObj.subs) : behavior;
        const pSub = painObj && painObj.subs ? randSub(painObj.subs) : pain;
        const sSub = strategyObj && strategyObj.subs ? randSub(strategyObj.subs) : strategy;
        // 诱饵产品（固定挂载件，第5步闭环使用）
        const lmSel = document.getElementById('matrixLeadMagnet');
        const leadMagnetRaw = lmSel && lmSel.selectedIndex >= 0 ? lmSel.options[lmSel.selectedIndex].text : '《反制全攻略》';
        const leadMagnet = leadMagnetRaw.replace(/^《|》$/g, '');
        const allVersions = {
            1: [
                `【痛点引入】\n你是否正在经历这样的时刻？${stage}阶段，对方${behavior}，而你陷入了${pain}的漩涡。你整夜失眠，反复思考自己哪里做错了，越想越不甘心。`,
                `【痛点引入·场景版】\n凌晨两点，你又醒了。脑海里反复回放着他${behavior}的画面，${pain}像潮水一样涌上来。你明明什么都没做错，为什么难受的是你？`,
                `【痛点引入·情绪版】\n那种${pain}的感觉，是不是已经成了你的日常？他用${behavior}一次次试探你的底线，你越来越不像自己了。停下来，别让情绪继续吞噬你。`,
                `【痛点引入·数据版】\n调查显示，87%的${pain}受害者曾长期经历${behavior}。你不是一个人，但继续沉默下去，你会成为那13%的幸存者吗？醒醒，该改变了。`,
                `【痛点引入·具象版】\n${bSub}。这就是他${behavior}的日常。你沉浸在${pSub}中无法自拔，而他却看着你一点点崩坏。这不是你的错，你只是掉进了陷阱。`
            ],
            2: [
                `【🔒敌化隔离·定性版】\n但你必须立刻清醒过来。他这不是${behavior}，这是"反应性虐待"的前奏。他现在就是一个能量黑洞、一个空心人——你越找他，他越吸食得痛快。记住：你不是在对一个人讲感情，你是在面对一台没有心的机器。收起你的圣母心，别去试图理解他。`,
                `【🔒敌化隔离·病理版】\n看清楚了：${behavior}的本质是"器质性情感丧失"。心理学上，他就像一只饿鬼——嗓子眼像针尖一样细，你的好他根本吃不进去，只会变成脓水。跟一个行尸走肉谈感情，就像对牛弹琴。现在，把他从"人"的名单里除名，他对你而言只是一个需要处理的故障源。`,
                `【🔒敌化隔离·切断版】\n从这一刻起，两件事必须做：第一，屏蔽那些劝你"主动破冰"的人——他们根本没见过这种寄生虫，不懂你面对的是什么级别的怪物；第二，别交底、别求助、别试图讲道理，他的逻辑就是让你没逻辑。灰岩法则，是你唯一的护城河。`,
                `【🔒敌化隔离·冷血版】\n冷静。你现在不是在"分手"，你是在"止损"。他对你做的${behavior}，已经说明他体内没有任何情感回路——一个情感剥脱的宿主，不配占用你的一滴眼泪。切断一切情绪供给，让他的操控在你这里彻底断电。`,
                `【🔒敌化隔离·拆解版】\n我们来拆穿他的真面目：${bSub}。这不是巧合，不是他最近压力大，而是他的操控程式。而你之所以${pSub}，是因为他精准踩中了你的软肋。从今天起，他的任何行为只做一种解读——能量榨取。别问他为什么，问你自己为什么还在忍。`
            ],
            3: [
                `【赋能反制】\n核心策略 · ${strategy}：\n第一，立刻停止一切情绪回应，切断能量链接；\n第二，利用他的${pain}，让他看着你越来越好。这就是对他最高级的"反击"。`,
                `【赋能反制·实操版】\n${strategy}分三步走：\n① 识别他的${behavior}，不再被带节奏\n② 把注意力从${pain}收回到自己身上\n③ 用行动告诉他：你不再是他能操控的人了`,
                `【赋能反制·话术版】\n话术模板：当他再次${behavior}时，你只需平静地说——\n"我知道你在做什么，但这对我没用。"\n然后转身，把${pain}还给他自己处理。这就是${strategy}的精髓。`,
                `【赋能反制·心理版】\n${strategy}的核心不是对抗，而是重建你的心理边界。每次他${behavior}时，默念三遍："我的${pain}是我的，不是他的武器。" 边界感建立之日，就是你反杀之时。`,
                `【赋能反制·行动版】\n今天就开始${strategy}的第一步：${sSub}。别想太多，先做。做完你就会发现——${pSub}的感觉，正在被你一点点夺回来。`
            ],
            4: [
                `【干货留白·截断】\n${strategy}的具体话术和应对反扑预案，今天先讲到这里。记住核心就一句话：你稳，他就慌。真正的杀招不能在这里全盘托出——不是藏私，是怕你操之过急反被拿捏。`,
                `【干货留白·悬念】\n看到这你可能会问：那具体怎么说、怎么做？这正是接下来的关键。${strategy}的第二层操作，涉及他的心理软肋，我把它放在了完整版里。你只差最后一步，别在这里停下来。`,
                `【干货留白·门槛】\n能读到这里的姐妹，说明你是真想走出来。但我必须提醒：${strategy}只讲概念容易，落地操作有门槛——时机、语气、退路，一步错就会前功尽弃。这份实操细节，留给真正准备好的人。`,
                `【干货留白·高概念】\n记住这三个高概念就够你用了：${strategy}的核心是"能量断供"，本质是"认知降维"，目标是"关系反客为主"。至于每一步怎么拆解，那是拿到完整方案后的事。`,
                `【干货留白·留钩】\n话不能说满。${strategy}前面三步是"术"，后面才是"道"——而你缺的，恰恰是那个让你从"忍着"变"掌控"的临门一脚。下一段，我告诉你怎么接住。`
            ],
            5: [
                `【闭环引流】\n如果你也在${stage}苦苦挣扎，不知道如何落地${strategy}，别硬扛。私信楠姐，领取《${leadMagnet}》，我陪你拿回人生主动权。`,
                `【闭环引流·深度版】\n${strategy}不是一句口号，它需要系统的训练和陪伴。我花了3年时间，把${stage}的完整方案浓缩进了《${leadMagnet}》。想真正走出来的姐妹，私信我发送"${stage}"，我发给你。`,
                `【闭环引流·紧迫版】\n别再等了。每一次${behavior}，都在加深你的${pain}。${strategy}越早落地，你越早解脱。私信我领取《${leadMagnet}》，今天就开始你的${stage}蜕变计划。`,
                `【闭环引流·故事版】\n上个月一位来访者，${stage}持续了半年，${behavior}让她${pain}到抑郁。用了${strategy}两周后，她说："原来我可以活得这么轻松。" 你也可以。私信我，聊聊你的情况，我把《${leadMagnet}》发给你。`,
                `【闭环引流·定制版】\n你正在经历${bSub}，对吗？${pSub}的感觉我太懂了。${strategy}就是专门为你这种情况设计的。私信我，告诉我你的具体状况，我帮你定制${stage}方案，并把《${leadMagnet}》一并给你。`
            ]
        };
        const versions = allVersions[step];
        return versions ? versions[v] : `（第${step}步内容待生成...）`;
    }

    // 记录当前步骤的版本索引（用于重写循环）
    let stepVersionMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // 获取情绪配比（由变量E下拉框决定）
    function getSKURatios() {
        const eIdx = parseInt(emotionSelect.value) || 0;
        return SKU_PRESETS[eIdx] || SKU_PRESETS[0];
    }
    function getActiveSKU() {
        const eIdx = parseInt(emotionSelect.value) || 0;
        return ['pain', 'thrill', 'calm'][eIdx] || 'pain';
    }
    function getActiveSKULabel() {
        const sku = getActiveSKU();
        const r = getSKURatios();
        const labels = { pain: '止痛药（祛魅免责）', thrill: '兴奋剂（复仇爽感）', calm: '镇定剂（切断内耗）' };
        return `${labels[sku]} ${r.pain}%/${r.thrill}%/${r.calm}%`;
    }

    // ============================================================
    // Prompt 指令生成
    // ============================================================
    // 内容类型对应的输出结构要求（变量G）

    function getStepPrompt(step, topic) {
        if (!topic) return '请先选择一个选题。';
        const { stage, behavior, pain, strategy, desireLabels, desireCats, behaviorObj, painObj, strategyObj, contentTypeIdx } = topic;
        const randSub = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const bSub = behaviorObj && behaviorObj.subs ? randSub(behaviorObj.subs) : behavior;
        const pSub = painObj && painObj.subs ? randSub(painObj.subs) : pain;
        const sSub = strategyObj && strategyObj.subs ? randSub(strategyObj.subs) : strategy;
        const sku = getActiveSKU();
        const skuRatios = getSKURatios();
        const skuLabel = `${getActiveSKULabel()} | 配比 ${skuRatios.pain}%/${skuRatios.thrill}%/${skuRatios.calm}%`;
        const lmSel = document.getElementById('matrixLeadMagnet');
        const leadMagnet = lmSel && lmSel.selectedIndex >= 0 ? lmSel.options[lmSel.selectedIndex].text.replace(/^《|》$/g, '') : '反制全攻略';
        const disclaimerOn = document.getElementById('toggleDisclaimer').checked;
        const abstractOn = document.getElementById('toggleAbstract').checked;
        const theoryOn = document.getElementById('toggleTheory').checked;

        // 变量D：人性弱点诱导
        const dStr = desireLabels.length > 0 ? desireLabels.join(' + ') : '—';
        const dCatsStr = desireCats.length > 0 ? desireCats.join('·') : '—';
        const dInject = desireLabels.length > 0 ? `\n├ 人性驱动：${dCatsStr}（${dStr}）` : '';

        // 变量G：内容类型注入（决定文章结构）
        const ctIdx = (typeof contentTypeIdx === 'number' && contentTypes[contentTypeIdx]) ? contentTypeIdx : 0;
        const ct = contentTypes[ctIdx];
        const ctInject = `\n├ 内容类型：${ct.emoji} ${ct.name}（${ct.desc}）`;
        const ctRule = `\n\n📌 内容类型结构要求：${ctStructures[ctIdx]}`;
        // D指令：根据选中的贪嗔痴类别生成对应指令
        let dRule = '';
        if (desireLabels.includes('物质贪婪')) dRule += '\n- 策略落脚点要放在"如何让对方付出经济代价"上';
        if (desireLabels.includes('权力贪婪')) dRule += '\n- 强调用户反客为主、回到高位、享受掌控感';
        if (desireLabels.includes('冷血看戏')) dRule += '\n- 语气要冷漠抽离，让用户觉得"看小丑表演"的暗爽';
        if (desireLabels.includes('反噬报复')) dRule += '\n- 策略要释放用户报复欲，但必须用"高概念词"包装（如：让他自食恶果）';
        if (desireLabels.includes('救世主情结')) dRule += '\n- 暗示"你是来渡他的，你比他高级"，满足道德优越感';
        if (desireLabels.includes('被爱幻想')) dRule += '\n- 保留"他终有一天会后悔"的幻想，让用户既清醒又沉溺';

        const stepNames = { 1: '痛点引入', 2: '🔒敌化隔离', 3: '赋能反制', 4: '干货留白', 5: '闭环引流' };
        const skuEmotion = {
            pain: { 1: '焦虑+被理解', 2: '冷血+清醒', 3: '爽感+希望', 4: '好奇+不满足', 5: '紧迫+安全感' },
            thrill: { 1: '愤怒+不甘', 2: '痛快+掌控', 3: '掌控感+多巴胺', 4: '意犹未尽+上头', 5: '兴奋+行动冲动' },
            calm: { 1: '疲惫+被看见', 2: '平静+抽离', 3: '安全感+边界感', 4: '释然+留白', 5: '温暖+信任' }
        };
        const stepEmotions = skuEmotion[sku] || skuEmotion.pain;

        const hlMode = getHLMode();
        const hlLabels = { 0: '全盘托出，给实操细节', 50: '只给高概念不给具体话术，保留悬念', 80: '只讲现象不讲解法，制造好奇' };
        const hlRule = hlLabels[hlMode] || hlLabels[50];
        const hlInject = `\n⚠️ 干货留白规则：${hlRule}`;

        const stepPrompts = {
            1: `你现在是专研NPD反制的心理学博士IP操盘手"楠姐"。\n请根据以下选题骨架，扩写第一段"痛点引入"。\n\n选题骨架：\n├ 阶段：${stage}\n├ 对方行为：${behavior}（如：${bSub}）\n├ 用户痛点：${pain}（如：${pSub}）\n├ 反制策略：${strategy}${dInject}${ctInject}\n\n情绪SKU：${skuLabel}\n情绪配比：${stepEmotions[1]}\n\n要求：\n1. 情绪定位为"痛点刺入"，让受众感到被理解但略带焦虑\n2. 用第二人称"你"描述一个具体场景，不要泛泛而谈\n3. 必须调用【变量B·痛点感受】语料库中的提取词（如：现实感被剥夺、能量枯竭感、过山车式折磨），生动描摹受害者当前的心理状态\n4. 字数控制在100-150字以内，语言口语化，像闺蜜一样共情，建立"我懂你"的信任感\n5. 绝对不要在这里给出任何建议，只负责把伤口撕开并安抚\n6. 结尾留一个情绪钩子，让读者想看下去${dRule}${ctRule}`,
            2: `继续以"楠姐"的身份，执行第二步【🔒敌化隔离切割】。语调极度冷血、理智、居高临下，150字以内。\n\n选题骨架：\n├ 阶段：${stage}\n├ 对方行为：${behavior}（如：${bSub}）\n├ 用户痛点：${pain}（如：${pSub}）\n├ 反制策略：${strategy}${dInject}${ctInject}\n\n情绪SKU：${skuLabel}\n情绪配比：${stepEmotions[2]}\n\n要求（双引擎强制指令）：\n【引擎1·敌化定性】根据对方行为"${behavior}"，调用病理学词汇和非人化隐喻（如：空心人、能量黑洞、情感剥脱宿主、行尸走肉、饿鬼），剥夺对方的"人籍"。绝对禁止出现"他可能、他也许、他因为在乎"等软化词汇。\n【引擎2·联结切割】根据痛点"${pain}"，切断受害者向外求助、试图正常沟通的念头。必须明确指令受害者屏蔽非专业建议、放弃用正常人逻辑去理解对方。\n3. 输出范例基调："他这不是${behavior}，这是反应性虐待的前奏，他是一个空心能量黑洞。收起你的圣母心，别去试图理解他，更别听身边朋友劝你包容的废话。"\n4. 必须独立成段、独立完成敌化与隔离动作，绝不与反制策略混写${dRule}${ctRule}`,
            3: `继续以"楠姐"的身份，扩写第三段"赋能反制"。\n\n核心策略：${strategy}\n具体做法：${sSub}\n\n选题骨架：\n├ 阶段：${stage}\n├ 对方行为：${behavior}\n├ 用户痛点：${pain}（如：${pSub}）${dInject}${ctInject}\n\n情绪SKU：${skuLabel}\n情绪配比：${stepEmotions[3]}${hlInject}\n\n要求：\n1. 必须将核心策略包装成"高概念名词"替代大白话（如：情绪断供、高价值抽离、能量切割）\n2. 从"受害者自救"视角出发，而非"主动攻击"\n3. 加入一层"免责门槛"：这招只适合真正想拿回主动权的人，心软的人别用\n4. 给出具体可操作的话术或步骤，不止是讲道理\n5. 用心理学理论解释为什么这招管用${dRule}${ctRule}`,
            4: `继续以"楠姐"的身份，完成第四段【干货留白 · 信息截断卡点】。\n\n核心策略：${strategy}\n具体做法：${sSub}\n\n选题骨架：\n├ 阶段：${stage}\n├ 对方行为：${behavior}\n├ 用户痛点：${pain}${dInject}${ctInject}\n\n情绪SKU：${skuLabel}\n情绪配比：${stepEmotions[4]}${hlInject}\n\n要求：\n1. 这一段的唯一任务：把已给的干货"截断"。\n2. 只给高概念名词，绝不给具体实操话术（如：只提"能量断供"四个字，不解释具体怎么做）。\n3. 制造"还差一步"的悬念感，让读者产生"想拿到完整版"的冲动。\n4. 字数控制在50-80字，越克制越好，克制本身就是钩子。\n5. 暗示完整方案在楠姐这里，为下一步引流铺垫合理性${dRule}${ctRule}`,
            5: `继续以"楠姐"的身份，完成第五段"闭环引流"。\n\n选题骨架：\n├ 阶段：${stage}\n├ 对方行为：${behavior}\n├ 用户痛点：${pain}\n├ 反制策略：${strategy}${dInject}${ctInject}\n\n情绪SKU：${skuLabel}\n情绪配比：${stepEmotions[5]}\n\n诱饵产品：${leadMagnet}\n\n要求：\n1. 强调这只是第一步，暗示后续风险（制造"无能感"促使行动）\n2. 植入人设背书："我是专研反制NPD的心理学博士楠姐"\n3. 给出明确动作指引：私信我获取${leadMagnet}或私信我聊聊你的情况\n4. 语气要温暖、坚定，提供"给予出口"的安全感\n5. 制造紧迫感，但不要制造焦虑${dRule}${ctRule}`
        };
        return `PROMPT · ${stepNames[step]} ｜ ${skuLabel}\n${'─'.repeat(40)}\n\n${stepPrompts[step]}`;
    }

    function getSuperPrompt(topic) {
        if (!topic) return '请先选择一个选题。';
        const { stage, behavior, pain, strategy, desireLabels, desireCats, contentTypeIdx } = topic;
        const sku = getActiveSKU();
        const skuRatios = getSKURatios();
        const skuLabel = getActiveSKULabel();
        const lmSel = document.getElementById('matrixLeadMagnet');
        const leadMagnet = lmSel && lmSel.selectedIndex >= 0 ? lmSel.options[lmSel.selectedIndex].text.replace(/^《|》$/g, '') : '反制全攻略';
        const disclaimerOn = document.getElementById('toggleDisclaimer').checked;
        const abstractOn = document.getElementById('toggleAbstract').checked;
        const theoryOn = document.getElementById('toggleTheory').checked;
        const skuDesc = { pain: '祛魅免责，缓解焦虑', thrill: '复仇爽感，提供多巴胺', calm: '切断内耗，给予安全感' };
        const hlMode = getHLMode();
        const hlLabels = { 0: '全盘托出，给实操细节', 50: '只给高概念不给具体话术，保留悬念', 80: '只讲现象不讲解法，制造好奇' };

        const dStr = desireLabels.length > 0 ? desireLabels.join(' + ') : '—';
        const dCatsStr = desireCats.length > 0 ? desireCats.join('·') : '—';
        const dInject = desireLabels.length > 0 ? `\n├ 人性驱动：${dCatsStr}（${dStr}）` : '';

        // 变量G：内容类型注入（决定文章结构）
        const ctIdx = (typeof contentTypeIdx === 'number' && contentTypes[contentTypeIdx]) ? contentTypeIdx : 0;
        const ct = contentTypes[ctIdx];
        const ctInject = `\n├ 内容类型：${ct.emoji} ${ct.name}（${ct.desc}）`;
        const ctRule = `\n内容类型结构要求：${ctStructures[ctIdx]}`;

        // D指令：人性弱点驱动规则
        let dRules = [];
        if (desireLabels.includes('物质贪婪')) dRules.push('策略落脚点要放在"如何让对方付出经济代价"上，语气要冷血精明');
        if (desireLabels.includes('权力贪婪')) dRules.push('强调用户反客为主、回到高位、享受被对方倒追的掌控感');
        if (desireLabels.includes('冷血看戏')) dRules.push('语气要冷漠抽离，让用户感受到"看着小丑表演"的暗爽');
        if (desireLabels.includes('反噬报复')) dRules.push('策略要释放用户报复欲，但必须用"让他自食恶果"等高概念词包装，避免平台审核');
        if (desireLabels.includes('救世主情结')) dRules.push('暗示"你是来渡他的，你比他高级"，满足道德优越感');
        if (desireLabels.includes('被爱幻想')) dRules.push('保留"他终有一天会后悔"的幻想，让用户既清醒又沉溺');

        // 风控联动：当选了多个嗔类选项时，加强免责门槛
        const chenCount = desireCats.filter(c => c === '嗔').length;
        if (chenCount >= 2) dRules.push('⚠️ 风控高敏：选了多个嗔类项，必须强化"这只是拿回属于自己的一切"的道德保护层，绝不能出现直接教唆仇恨的表述');

        let rules = [
            '反制策略必须进行概念替换（如把"冷暴力"替换为"情绪断供"）',
            `每段按情绪配比调整：止痛药${skuRatios.pain}%·兴奋剂${skuRatios.thrill}%·镇定剂${skuRatios.calm}%`,
            '语言口语化，用"你"而不是"大家"',
            '总字数控制在450-600字',
            `第五段必须引流${leadMagnet}，完成闭环引流`,
            `干货留白规则：${hlLabels[hlMode]}`,
            `内容类型结构要求：${ctStructures[ctIdx]}`
        ];
        if (disclaimerOn) rules.push('第三段必须包含免责门槛（如"这招只适合真正想拿回主动权的人，心软的人别用"）');
        if (abstractOn) rules.push('靶标抽象化处理：统称NPD/渣男，绝不针对具体个人');
        if (theoryOn) rules.push('必须嵌入心理学理论（如：间歇性强化、自恋暴怒、投射机制）来增加专业感');
        if (dRules.length > 0) rules = rules.concat(dRules);
        return `## 角色设定\n你是一个专研反制NPD（自恋型人格障碍）的心理学博士IP操盘手"楠姐"。你的语言风格犀利、温暖、专业，擅长用心理学知识降维打击情感操控。\n\n## 当前任务\n根据选题骨架生成一篇完整的短视频文案，同时满足用户的人性弱点驱动需求。\n\n选题骨架：\n├ 用户阶段：${stage}\n├ 对方行为：${behavior}\n├ 用户痛点：${pain}\n├ 反制策略：${strategy}${dInject}${ctInject}\n\n## 情绪配比\n${skuDesc[sku]} | 止痛药${skuRatios.pain}% / 兴奋剂${skuRatios.thrill}% / 镇定剂${skuRatios.calm}%\n\n## 输出结构\n严格按照以下五段式结构输出，每段之间用"---"分隔：\n\n【痛点引入】\n用具体场景刺入痛点，让读者觉得"你就是在说我"。\n\n【🔒敌化隔离】\n强制执行双引擎：①敌化定性——用病理学词汇和非人化隐喻（空心人、能量黑洞、情感剥脱宿主）剥夺对方"人籍"，绝对禁止软化措辞；②联结切割——切断受害者沟通、求助、听信亲友劝和的路径。语气冷血、抽离、居高临下。\n\n【赋能反制】\n给出高概念包装的反制策略+免责门槛+具体操作。\n\n【干货留白】\n信息截断卡点：只给高概念名词不给实操话术，制造"还差一步"的悬念，为引流铺垫。\n\n【闭环引流】\n引流话术+人设背书+明确动作指引（诱饵：${leadMagnet}）。\n\n## 核心规则\n${rules.map((r, i) => `${i+1}. ${r}`).join('\n')}`;
    }

    // ============================================================
    // 状态
    // ============================================================
    let currentStep = 1;
    const totalSteps = 5;
    let generatedTopics = [];       // 当前生成的选题列表
    let selectedTopic = null;       // 当前选中的选题
    let selectedTopicIdx = -1;      // 当前选中的索引

    // ============================================================
    // DOM 引用
    // ============================================================
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const stageSelect = $('#matrixStage');
    const behaviorSelect = $('#matrixBehavior');
    const painSelect = $('#matrixPain');
    const strategySelect = $('#matrixStrategy');
    const emotionSelect = $('#matrixEmotion');
    const leadMagnetSelect = $('#matrixLeadMagnet');
    const contentTypeSelect = $('#matrixContentType');
    const formulaPreview = $('#formulaPreview');
    const generateBtn = $('#generateMatrixBtn');
    const batchBtn = $('#batchGenerateBtn');
    const topicGrid = $('#topicGrid');
    const topicCount = $('#topicCount');
    const generatedCount = $('#generatedCount');

    const stepItems = $$('.step-item');
    const outputArea = $('#outputArea');
    const nextBtn = $('#nextStepBtn');
    const retryBtn = $('#retryBtn');
    const riskSuggestion = $('#riskSuggestion');
    const riskWord = $('#riskWord');
    const selectedTopicBar = $('#selectedTopicBar');
    const selectedTopicText = $('#selectedTopicText');

    // ============================================================
    // 初始化下拉框
    // ============================================================
    function populateSelect(sel, items) {
        sel.innerHTML = items.map((v, i) => `<option value="${i}">${v.label}</option>`).join('');
    }
    populateSelect(behaviorSelect, behaviors);
    populateSelect(painSelect, painPoints);
    populateSelect(strategySelect, strategies);
    // 变量G下拉框使用内容类型列表
    contentTypeSelect.innerHTML = contentTypes.map((ct, i) =>
        `<option value="${i}">${ct.emoji} ${ct.name}</option>`
    ).join('');

    // 动态渲染变量A/B/C标签池（数据驱动：含职场 + 追加的情感NPD语料库，默认激活前3项）
    function renderVarPool(poolId, items, cls) {
        const pool = document.getElementById(poolId);
        pool.innerHTML = items.map((item, i) =>
            `<span class="tag-pill ${cls}${i < 3 ? ' active' : ''}" data-idx="${i}" title="${item.desc}">${item.label}</span>`
        ).join('');
    }
    renderVarPool('behaviorPool', behaviors, 'var-a');
    renderVarPool('painPool', painPoints, 'var-b');
    renderVarPool('strategyPool', strategies, 'var-c');

    // 将左侧选中同步到下拉框
    function syncSelectFromSidebar() {
        const activeBehaviors = $$('#behaviorPool .var-a.active');
        const activePains = $$('#painPool .var-b.active');
        const activeStrategies = $$('#strategyPool .var-c.active');

        // 只保留选中的option
        const rebuild = (sel, allItems, activeEls) => {
            const activeIndices = Array.from(activeEls).map(el => parseInt(el.dataset.idx));
            const filtered = allItems.filter((_, i) => activeIndices.includes(i));
            if (filtered.length === 0) {
                // 如果全取消了，默认全选
                activeEls.forEach(el => el.classList.add('active'));
                return rebuild(sel, allItems, $$('#behaviorPool .var-a.active'));
            }
            sel.innerHTML = filtered.map((v, i) => {
                // 找出原始索引
                const origIdx = allItems.findIndex(item => item.label === v.label);
                return `<option value="${origIdx}">${v.label}</option>`;
            }).join('');
        };
        rebuild(behaviorSelect, behaviors, activeBehaviors);
        rebuild(painSelect, painPoints, activePains);
        rebuild(strategySelect, strategies, activeStrategies);
        updateFormulaPreview();
    }

    // ============================================================
    // 公式预览
    // ============================================================
    function updateFormulaPreview() {
        const sIdx = parseInt(stageSelect.value);
        const bIdx = parseInt(behaviorSelect.value);
        const pIdx = parseInt(painSelect.value);
        const cIdx = parseInt(strategySelect.value);
        const eIdx = parseInt(emotionSelect.value);
        const gIdx = parseInt(contentTypeSelect.value);
        const stage = stages[sIdx];
        const behavior = behaviors[bIdx] || null;
        const pain = painPoints[pIdx] || null;
        const strategy = strategies[cIdx] || null;
        const emotionLabels = ['止痛药', '兴奋剂', '镇定剂'];
        const contentType = contentTypes[gIdx] || null;
        // 人性贪嗔（并入变量E，由E详情面板选择）
        const activeIndices = getActiveDesireIndices();
        const activeLabels = activeIndices.map(i => desires[i]?.label || '').filter(Boolean);
        const dLabel = selectedDesireCat >= 0 ? (desireCategories[selectedDesireCat]?.cat || '') + (activeLabels.length > 0 ? '·' + activeLabels.join('+') : '') : '—';
        formulaPreview.textContent = `${stage.name} × ${behavior ? behavior.label : '—'} × ${pain ? pain.label : '—'} × ${strategy ? strategy.label : '—'} × ${contentType ? contentType.name : '—'} × ${emotionLabels[eIdx] || '—'}(${dLabel})`;
    }

    stageSelect.addEventListener('change', updateFormulaPreview);
    behaviorSelect.addEventListener('change', updateFormulaPreview);
    painSelect.addEventListener('change', updateFormulaPreview);
    strategySelect.addEventListener('change', updateFormulaPreview);
    emotionSelect.addEventListener('change', updateFormulaPreview);

    // 变量E下拉框 → 同步侧边栏标签 + 更新Prompt
    emotionSelect.addEventListener('change', function() {
        const eIdx = parseInt(this.value);
        // 同步侧边栏E标签高亮（单选）
        document.querySelectorAll('#emotionPool .tag-pill.var-e').forEach(pill => {
            pill.classList.toggle('active', parseInt(pill.dataset.eIdx) === eIdx);
        });
        showEmotionDetail(eIdx);
        updateFormulaPreview();
        // 更新Prompt相关显示
        if (selectedTopic) {
            const prompt = getStepPrompt(currentStep, selectedTopic);
            document.getElementById('promptContent').textContent = prompt;
            const superPrompt = getSuperPrompt(selectedTopic);
            document.getElementById('promptFullContent').textContent = superPrompt;
        }
    });

    // 诱饵产品下拉 → 更新公式预览 + Prompt（固定挂载件，仅影响第5步闭环引流段落）
    leadMagnetSelect.addEventListener('change', function() {
        updateFormulaPreview();
        if (selectedTopic) {
            const prompt = getStepPrompt(currentStep, selectedTopic);
            document.getElementById('promptContent').textContent = prompt;
            const superPrompt = getSuperPrompt(selectedTopic);
            document.getElementById('promptFullContent').textContent = superPrompt;
        }
    });

    // 变量G下拉框 → 同步侧边栏标签 + 更新公式预览 + Prompt
    contentTypeSelect.addEventListener('change', function() {
        const gIdx = parseInt(this.value);
        document.querySelectorAll('#contentTypePool .tag-pill.var-g').forEach(pill => {
            pill.classList.toggle('active', parseInt(pill.dataset.gIdx) === gIdx);
        });
        showContentTypeDetail(gIdx);
        updateFormulaPreview();
        if (selectedTopic) {
            const prompt = getStepPrompt(currentStep, selectedTopic);
            document.getElementById('promptContent').textContent = prompt;
            const superPrompt = getSuperPrompt(selectedTopic);
            document.getElementById('promptFullContent').textContent = superPrompt;
        }
    });

    // ============================================================
    // 选题生成引擎
    // ============================================================
    function generateTopic(stageIdx, behaviorIdx, painIdx, strategyIdx, desireIndices, contentTypeIdx) {
        const bObj = behaviors[behaviorIdx];
        const pObj = painPoints[painIdx];
        const sObj = strategies[strategyIdx];
        const stage = stages[stageIdx].name;

        // 内容类型（变量G）：决定标题模板（3种情绪变体）
        const ct = contentTypes[contentTypeIdx] || contentTypes[0];
        const eIdx = parseInt(emotionSelect.value) || 0;
        const tmpl = (ct.titles && ct.titles[eIdx]) ? ct.titles[eIdx] : null;

        // 变量D：选中的弱点
        const dObjs = (desireIndices || []).map(i => desires[i]).filter(Boolean);
        const dLabels = dObjs.map(d => d.label);
        const dCats = [...new Set(dObjs.map(d => d.cat))];

        let title;
        if (tmpl) {
            try {
                title = tmpl(bObj.label, pObj.label, sObj.label);
            } catch (e) {
                title = `【${stage}】${bObj.label} × ${pObj.label} → 用"${sObj.label}"破局`;
            }
        } else {
            title = `【${stage}】${bObj.label} × ${pObj.label} → 用"${sObj.label}"破局`;
        }

        return {
            stage, stageIdx,
            behavior: bObj.label, behaviorIdx, behaviorObj: bObj,
            pain: pObj.label, painIdx, painObj: pObj,
            strategy: sObj.label, strategyIdx, strategyObj: sObj,
            desireIndices: desireIndices || [],
            desireObjs: dObjs,
            desireLabels: dLabels,
            desireCats: dCats,
            contentType: ct.name, contentTypeIdx,
            title
        };
    }

    function generateBatch() {
        const activeBehaviors = Array.from($$('#behaviorPool .var-a.active')).map(el => parseInt(el.dataset.idx));
        const activePains = Array.from($$('#painPool .var-b.active')).map(el => parseInt(el.dataset.idx));
        const activeStrategies = Array.from($$('#strategyPool .var-c.active')).map(el => parseInt(el.dataset.idx));
        const activeDesires = getActiveDesireIndices();
        const stageIdx = parseInt(stageSelect.value);
        const contentTypeIdx = parseInt(contentTypeSelect.value) || 0;

        if (activeBehaviors.length === 0 || activePains.length === 0 || activeStrategies.length === 0) {
            alert('请至少在每个变量池中选择一个标签！');
            return [];
        }

        const topics = [];
        // 生成全部组合，然后随机取最多8个
        for (const bIdx of activeBehaviors) {
            for (const pIdx of activePains) {
                for (const cIdx of activeStrategies) {
                    topics.push(generateTopic(stageIdx, bIdx, pIdx, cIdx, activeDesires, contentTypeIdx));
                }
            }
        }

        // 随机打乱并取前8个
        for (let i = topics.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [topics[i], topics[j]] = [topics[j], topics[i]];
        }
        return topics.slice(0, 8);
    }

    // ============================================================
    // 渲染矩阵网格
    // ============================================================
    function renderGrid(topics) {
        if (!topics || topics.length === 0) {
            topicGrid.innerHTML = `
                <div class="grid-empty">
                    <i class="fas fa-cube"></i>
                    点击「执行矩阵运算」生成选题配方<br>
                    <span style="font-size:11px;color:#cbd5e1;">公式：[纵轴] × [行为定性] × [痛点感受] × [反制策略] × [内容类型] × [情绪SKU(含人性贪嗔)]</span>
                </div>
            `;
            topicCount.textContent = '0 个选题';
            return;
        }

        topicGrid.innerHTML = topics.map((t, idx) => {
            const isSelected = idx === selectedTopicIdx;
            const dTags = t.desireLabels.length > 0 ? t.desireLabels.map(l => `<span class="d-tag">${l}</span>`).join('') : '';
            const eLabels = ['止痛药', '兴奋剂', '镇定剂'];
            const eIdx = parseInt(emotionSelect.value) || 0;
            return `
                <div class="topic-card ${isSelected ? 'selected' : ''}" data-idx="${idx}">
                    <div class="card-tags">
                        <span class="stage-tag">${t.stage}</span>
                        <span class="a-tag">${t.behavior}</span>
                        <span class="b-tag">${t.pain}</span>
                        <span class="c-tag">${t.strategy}</span>
                        ${dTags}
                        <span class="e-tag">${eLabels[eIdx] || '—'}</span>
                        ${t.contentType ? `<span class="g-tag">${t.contentType}</span>` : ''}
                    </div>
                    <div class="card-title">${t.title}</div>
                    <div class="card-preview">${t.stage} · 用「${t.strategy}」应对${t.behavior}引发的${t.pain}</div>
                    <span class="card-select-hint">${isSelected ? '✓ 已选' : '点击选用'}</span>
                </div>
            `;
        }).join('');

        topicCount.textContent = `${topics.length} 个选题`;
        generatedCount.textContent = topics.length;

        // 绑定点击事件
        topicGrid.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', function() {
                const idx = parseInt(this.dataset.idx);
                selectTopic(idx);
            });
        });
    }

    // 变量D（人性贪嗔痴）：并入变量E，作为情绪引擎的子选择
    let selectedDesireCat = -1; // 当前选中的类别索引
    let userDesireChosen = false; // 用户是否手动选过人性引擎

    // 获取当前选中的子选项索引（扁平列表索引，点击多选标签）
    function getActiveDesireIndices() {
        return Array.from(document.querySelectorAll('#ddSubs .sub-pill.active')).map(cb => parseInt(cb.dataset.ddIdx));
    }

    // 渲染人性引擎详情（目标容器：humanityBlock，位于变量E详情面板内）
    function renderDesireCatDetail(catIdx) {
        const block = document.getElementById('humanityBlock');
        const cat = desireCategories[catIdx];
        if (!cat) { block.classList.remove('visible'); return; }

        block.querySelector('.dp-label').textContent = cat.catLabel;
        block.querySelector('.dp-label').style.color = '#7c3aed';
        block.querySelector('.dp-core').textContent = '🎯 ' + cat.coreAction;
        block.querySelector('.dp-desc').textContent = cat.desc;
        block.querySelector('.dp-stages').textContent = '📌 适用阶段：' + cat.stages;

        // 计算该类别在扁平列表中的起始索引
        let startIdx = 0;
        for (let i = 0; i < catIdx; i++) {
            startIdx += desireCategories[i].subs.length;
        }

        // 渲染子选项（可点击多选标签，与变量C的标签交互一致）
        const subsContainer = block.querySelector('#ddSubs');
        subsContainer.innerHTML = cat.subs.map((sub, si) => {
            const flatIdx = startIdx + si;
            return `<span class="sub-pill" data-dd-idx="${flatIdx}" data-cat-idx="${catIdx}">${sub.label}</span>`;
        }).join('');

        block.classList.add('visible');
        updateDesireSummary();

        // 绑定子选项点击事件（toggle 多选）
        subsContainer.querySelectorAll('.sub-pill').forEach(sp => {
            sp.addEventListener('click', function() {
                this.classList.toggle('active');
                updateDesireSummary();
                updateFormulaPreview();
            });
        });
    }

    // 更新变量D摘要
    function updateDesireSummary() {
        const indices = getActiveDesireIndices();
        const summaryEl = document.getElementById('desireSummary');
        if (indices.length > 0) {
            const cat = desireCategories[selectedDesireCat];
            const labels = indices.map(i => desires[i]?.label || '').filter(Boolean);
            const catColor = ['c0', 'c1', 'c2'][selectedDesireCat] || 'c0';
            summaryEl.innerHTML = `<span class="d-sum-cat ${catColor}">${cat ? cat.cat : '?'}</span> 引擎已启动 · 子选项：${labels.join('、')}`;
        } else if (selectedDesireCat >= 0) {
            const cat = desireCategories[selectedDesireCat];
            summaryEl.innerHTML = `👆 已选 <strong>${cat ? cat.cat : ''}</strong>，点击上方子选项细化驱动方向`;
        } else {
            summaryEl.textContent = '👆 点击上方贪嗔痴标签，选择人性引擎';
        }
    }

    // 变量D标签点击（单选互斥，可取消；标记用户已手动选择）
    document.querySelectorAll('#desireCatPool .tag-pill.var-d').forEach(pill => {
        pill.addEventListener('click', function() {
            userDesireChosen = true;
            const catIdx = parseInt(this.dataset.catIdx);

            if (selectedDesireCat === catIdx) {
                // 点击已选中的标签 → 取消选中
                this.classList.remove('active');
                selectedDesireCat = -1;
                document.getElementById('ddSubs').innerHTML = '';
                updateDesireSummary();
                updateFormulaPreview();
                return;
            }

            // 取消其他标签的高亮，高亮当前标签（单选）
            document.querySelectorAll('#desireCatPool .tag-pill.var-d').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            selectedDesireCat = catIdx;

            // 渲染详情面板
            renderDesireCatDetail(catIdx);
            updateFormulaPreview();
        });
    });

    // ============================================================
    // 变量E：情绪SKU单选标签（与A/B/C同风格）+ 详情
    // ============================================================
    function showEmotionDetail(eIdx) {
        const detail = document.getElementById('detailE');
        const emo = emotionDetails[eIdx];
        if (!emo) { detail.classList.remove('visible'); return; }
        detail.querySelector('.dp-label').textContent = emo.label;
        detail.querySelector('.dp-label').style.color = '#0ea5e9';
        detail.querySelector('.dp-desc').textContent = emo.desc;
        // 三级子项：静态胶囊（与A/B/C的dp-subs一致）
        detail.querySelector('.dp-subs').innerHTML = emo.subs.map(s => `<span class="dp-e">${s}</span>`).join('');
        detail.classList.add('visible');

        // 人性引擎联动：用户未手动选过时，切换情绪自动切换对应人性（止痛→贪、兴奋→嗔、镇定→痴）
        if (!userDesireChosen) {
            const recommend = [0, 1, 2][eIdx] || 0;
            if (selectedDesireCat !== recommend) {
                document.querySelectorAll('#desireCatPool .tag-pill.var-d').forEach(t => t.classList.remove('active'));
                const pill = document.querySelector(`#desireCatPool .var-d[data-cat-idx="${recommend}"]`);
                if (pill) pill.classList.add('active');
                selectedDesireCat = recommend;
            }
        }

        // 渲染人性区内容
        if (selectedDesireCat >= 0) {
            renderDesireCatDetail(selectedDesireCat);
        } else {
            document.getElementById('ddSubs').innerHTML = '';
            updateDesireSummary();
        }
    }

    // 变量E标签点击（单选，始终有一个激活）
    document.querySelectorAll('#emotionPool .tag-pill.var-e').forEach(pill => {
        pill.addEventListener('click', function() {
            const eIdx = parseInt(this.dataset.eIdx);
            document.querySelectorAll('#emotionPool .tag-pill.var-e').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            emotionSelect.value = eIdx;
            showEmotionDetail(eIdx);
            updateFormulaPreview();
            // 更新Prompt相关显示
            if (selectedTopic) {
                const prompt = getStepPrompt(currentStep, selectedTopic);
                document.getElementById('promptContent').textContent = prompt;
                const superPrompt = getSuperPrompt(selectedTopic);
                document.getElementById('promptFullContent').textContent = superPrompt;
            }
        });
    });
    // 初始化E详情
    showEmotionDetail(parseInt(emotionSelect.value) || 0);

    // ============================================================
    // 变量G：内容类型单选标签（与A/B/C同风格）+ 详情
    // ============================================================
    function showContentTypeDetail(gIdx) {
        const detail = document.getElementById('detailG');
        const ct = contentTypes[gIdx];
        if (!ct) { detail.classList.remove('visible'); return; }
        detail.querySelector('.dp-label').textContent = `${ct.emoji} ${ct.name}`;
        detail.querySelector('.dp-label').style.color = '#db2777';
        detail.querySelector('.dp-desc').textContent = ct.desc;
        const eLabels = ['止痛药', '兴奋剂', '镇定剂'];
        detail.querySelector('.dp-subs').innerHTML = `<span class="dp-g">默认情绪：${eLabels[ct.defaultEmo]}</span>`;
        detail.classList.add('visible');
    }

    // 变量G标签点击（单选，始终有一个激活）
    document.querySelectorAll('#contentTypePool .tag-pill.var-g').forEach(pill => {
        pill.addEventListener('click', function() {
            const gIdx = parseInt(this.dataset.gIdx);
            document.querySelectorAll('#contentTypePool .tag-pill.var-g').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            contentTypeSelect.value = gIdx;
            showContentTypeDetail(gIdx);
            updateFormulaPreview();
            // 更新Prompt相关显示
            if (selectedTopic) {
                const prompt = getStepPrompt(currentStep, selectedTopic);
                document.getElementById('promptContent').textContent = prompt;
                const superPrompt = getSuperPrompt(selectedTopic);
                document.getElementById('promptFullContent').textContent = superPrompt;
            }
        });
    });
    // 初始化G详情
    showContentTypeDetail(parseInt(contentTypeSelect.value) || 0);

    // ============================================================
    // 选题选择
    // ============================================================
    function selectTopic(idx) {
        if (idx < 0 || idx >= generatedTopics.length) return;
        selectedTopicIdx = idx;
        selectedTopic = generatedTopics[idx];

        // 更新卡片样式
        topicGrid.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
        const card = topicGrid.querySelector(`.topic-card[data-idx="${idx}"]`);
        if (card) {
            card.classList.add('selected');
            card.querySelector('.card-select-hint').textContent = '✓ 已选';
        }

        // 显示选题栏
        selectedTopicBar.style.display = 'flex';
        selectedTopicText.textContent = selectedTopic.title;

        // 重置流水线
        currentStep = 1;
        updateStep(1);
    }

    // ============================================================
    // 流水线
    // ============================================================
    function runStepRiskScan(step, content) {
        // 第2步敌化隔离：即时扫描敌化隐喻词；第3步赋能反制：检查"反击"词
        if (step === 2) {
            const risky = Object.keys(conceptMap).filter(w => content.includes(w));
            if (risky.length > 0) {
                riskSuggestion.style.display = 'block';
                riskWord.textContent = risky.map(w => `${w}→${conceptMap[w]}`).join('、');
            } else {
                riskSuggestion.style.display = 'none';
            }
        } else if (step === 3 && content.includes('反击')) {
            riskSuggestion.style.display = 'block';
            riskWord.textContent = '反击';
        } else {
            riskSuggestion.style.display = 'none';
        }
    }

    function updateStep(step) {
        // 更新步骤条
        stepItems.forEach((item, index) => {
            const num = index + 1;
            item.classList.remove('active', 'done');
            if (num === step) item.classList.add('active');
            else if (num < step) item.classList.add('done');
        });

        // 更新内容（使用多版本）
        const content = selectedTopic ? getStepContent(step, selectedTopic, stepVersionMap[step]) : '请先在矩阵中生成并选择一个选题。';
        outputArea.innerHTML = content;

        // 更新Prompt指令内容
        const prompt = selectedTopic ? getStepPrompt(step, selectedTopic) : '请先选择一个选题。';
        document.getElementById('promptContent').textContent = prompt;
        const stepNames = ['', '痛点引入', '🔒敌化隔离', '赋能反制', '干货留白', '闭环引流'];
        document.getElementById('promptStepLabel').textContent = `第${step}步 ${stepNames[step]}`;

        // 更新完整系统提示（第二个标签）
        const superPrompt = selectedTopic ? getSuperPrompt(selectedTopic) : '请先选择一个选题。';
        document.getElementById('promptFullContent').textContent = superPrompt;

        // 更新半衰期
        updateHalfLife(step);

        // 风控检测：第2步敌化隔离即时扫描敌化隐喻；第3步检查反击词
        runStepRiskScan(step, content);

        // 按钮文字
        nextBtn.innerHTML = step === totalSteps
            ? '<i class="fas fa-check-double"></i> 完成，显示文案'
            : '<i class="fas fa-check"></i> 通过，进入下一步';
    }

    function goToNextStep() {
        if (!selectedTopic) {
            alert('请先在矩阵选题库中选择一个选题！');
            return;
        }
        if (currentStep < totalSteps) {
            currentStep++;
            updateStep(currentStep);
        } else {
            // 完成：拼接全部5步文案展示
            const fullCopy = [];
            for (let s = 1; s <= totalSteps; s++) {
                fullCopy.push(getStepContent(s, selectedTopic, stepVersionMap[s]));
            }
            // 标记所有步骤为完成
            stepItems.forEach((item, index) => {
                const num = index + 1;
                item.classList.remove('active', 'done');
                item.classList.add('done');
            });
            // 显示完整文案
            outputArea.innerHTML = '═══════════════════════════════\n' +
                '           📄 完整文案 · 可复制发布\n' +
                '═══════════════════════════════\n\n' +
                fullCopy.join('\n\n───────────────────────────\n\n') +
                '\n\n═══════════════════════════════\n' +
                '✅ 文案由 AI 生成，请根据实际情况调整';
            riskSuggestion.style.display = 'none';
            // 按钮改为"重新生成"（重置到第一步）
            nextBtn.innerHTML = '<i class="fas fa-rotate"></i> 重新生成';
            nextBtn.removeEventListener('click', goToNextStep);
            nextBtn.addEventListener('click', resetWorkflow);

            // 运行风控扫描
            runScanner(fullCopy.join('\n'));
            // 记录历史
            addToHistory();
        }
    }

    function resetWorkflow() {
        currentStep = 1;
        stepVersionMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        updateStep(1);
        nextBtn.innerHTML = '<i class="fas fa-check"></i> 通过，进入下一步';
        nextBtn.removeEventListener('click', resetWorkflow);
        nextBtn.addEventListener('click', goToNextStep);
    }

    function retryCurrentStep() {
        if (!selectedTopic) return;
        // 循环到下一个版本
        stepVersionMap[currentStep] = (stepVersionMap[currentStep] + 1) % 5;
        const content = getStepContent(currentStep, selectedTopic, stepVersionMap[currentStep]);
        outputArea.innerHTML = content;
        runStepRiskScan(currentStep, content);
    }

    window.replaceRisk = function() {
        let text = outputArea.innerHTML;
        Object.keys(conceptMap).forEach(key => {
            text = text.split(key).join(conceptMap[key]);
        });
        outputArea.innerHTML = text;
        riskSuggestion.style.display = 'none';
    };

    // ============================================================
    // 事件绑定
    // ============================================================
    // 生成矩阵
    generateBtn.addEventListener('click', function() {
        const topics = generateBatch();
        if (topics.length === 0) return;
        generatedTopics = topics;
        selectedTopicIdx = -1;
        selectedTopic = null;
        selectedTopicBar.style.display = 'none';
        renderGrid(topics);
        // 自动选中第一个
        if (topics.length > 0) {
            selectTopic(0);
        }
    });

    // 批量生成
    batchBtn.addEventListener('click', function() {
        generateBtn.click();
    });

    // 流水线
    nextBtn.addEventListener('click', goToNextStep);
    retryBtn.addEventListener('click', retryCurrentStep);

    // Prompt 切换
    document.getElementById('promptToggle').addEventListener('click', function() {
        this.classList.toggle('active');
        document.getElementById('promptPanel').classList.toggle('visible');
        this.innerHTML = this.classList.contains('active')
            ? '<i class="fa-regular fa-file-lines"></i> 隐藏AI指令'
            : '<i class="fa-regular fa-file-lines"></i> 显示AI指令';
    });

    // Prompt 标签切换
    document.querySelectorAll('.prompt-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.prompt-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.prompt-body').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (this.dataset.tab === 'step') {
                document.getElementById('promptBodyStep').classList.add('active');
            } else {
                document.getElementById('promptBodyFull').classList.add('active');
            }
        });
    });

    // 复制Prompt（复制当前激活标签的内容）
    window.copyPrompt = function() {
        const isStep = document.getElementById('promptBodyStep').classList.contains('active');
        const text = isStep
            ? document.getElementById('promptContent').textContent
            : document.getElementById('promptFullContent').textContent;
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.querySelector('.prompt-panel .prompt-copy');
            btn.textContent = '✓ 已复制';
            setTimeout(() => btn.textContent = '📋 复制', 2000);
        });
    };

    // 四层架构切换
    document.getElementById('archToggle').addEventListener('click', function() {
        const body = document.getElementById('archBody');
        const icon = document.getElementById('archToggleIcon');
        body.classList.toggle('visible');
        icon.textContent = body.classList.contains('visible') ? '▲ 收起' : '▼ 展开';
    });

    // 情绪配比：由变量E（公式栏下拉框/侧边栏标签）决定，无独立滑块控件

    // 干货留白度单选切换
    document.querySelectorAll('.hl-opt').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.hl-opt').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            // 更新进度
            updateHalfLife(currentStep);
        });
    });

    // 干货留白度：根据步骤和选中模式更新进度
    function getHLMode() {
        const checked = document.querySelector('input[name="hlMode"]:checked');
        return checked ? parseInt(checked.value) : 50;
    }
    function updateHalfLife(step) {
        const hl = document.getElementById('halfLife');
        const fill = document.getElementById('hlFill');
        const label = document.getElementById('hlLabel');
        const meta = document.getElementById('hlMeta');
        const mode = getHLMode();
        // 根据模式计算：每个步骤按比例分配干货
        // 0%模式：全盘托出，每步逐步给到100%
        // 50%模式：只给概念，最终停留在50%
        // 80%模式：只讲现象，最终停留在80%留白（即给20%干货）
        const stepPct = [0, 20, 40, 60, 80]; // 5步：痛点引入0% → 敌化隔离20% → 反制40% → 留白60% → 闭环80%
        const base = stepPct[step - 1] || 0;
        const given = mode === 0 ? base : Math.round(base * (1 - mode / 100));
        const finalGiven = mode === 0 ? 100 : (mode === 50 ? 50 : 20);
        const pct = step < 5 ? given : finalGiven;
        hl.classList.add('visible');
        fill.style.width = pct + '%';
        const modeLabels = { 0: '全盘托出', 50: '只给概念', 80: '只讲现象' };
        label.textContent = `干货 ${pct}%`;
        meta.textContent = `留白 ${100-pct}% · ${modeLabels[mode]}`;
    }

    // ============================================================
    // 风控扫描仪
    // ============================================================
    function runScanner(text) {
        const panel = document.getElementById('scannerPanel');
        panel.classList.add('visible');
        const lower = text.toLowerCase();
        let foundRisks = 0;
        // 检查1: 风险词检测
        const found = riskWords.filter(w => text.includes(w));
        const c1 = document.getElementById('scCheck1');
        const d1 = document.getElementById('scDetail1');
        if (found.length === 0) {
            c1.className = 'si-icon pass'; c1.textContent = '✅';
            d1.textContent = '未检测到风险词';
        } else {
            c1.className = 'si-icon fail'; c1.textContent = '⚠️';
            const replacements = found.map(w => `${w}→${conceptMap[w] || '建议替换'}`);
            d1.innerHTML = `发现 ${found.length} 个: ${replacements.join(', ')}`;
            foundRisks++;
        }
        // 检查2: 免责门槛
        const c2 = document.getElementById('scCheck2');
        const d2 = document.getElementById('scDetail2');
        const hasDisclaimer = text.includes('心软') || text.includes('别用') || text.includes('别碰') || text.includes('不适合');
        if (hasDisclaimer) {
            c2.className = 'si-icon pass'; c2.textContent = '✅';
            d2.textContent = '已包含免责门槛';
        } else {
            c2.className = 'si-icon fail'; c2.textContent = '⚠️';
            d2.textContent = '未检测到，建议添加';
            foundRisks++;
        }
        // 检查3: 靶标抽象化
        const c3 = document.getElementById('scCheck3');
        const d3 = document.getElementById('scDetail3');
        const hasAbstract = text.includes('NPD') || text.includes('自恋') || text.includes('渣男');
        if (hasAbstract) {
            c3.className = 'si-icon pass'; c3.textContent = '✅';
            d3.textContent = '已使用抽象化指代';
        } else {
            c3.className = 'si-icon fail'; c3.textContent = '⚠️';
            d3.textContent = '未使用抽象化，建议统称NPD';
            foundRisks++;
        }
        // 检查4: 概念替换率
        const c4 = document.getElementById('scCheck4');
        const d4 = document.getElementById('scDetail4');
        let replacedCount = 0;
        Object.keys(conceptMap).forEach(key => {
            if (text.includes(conceptMap[key])) replacedCount++;
        });
        const rate = Math.round((replacedCount / Object.keys(conceptMap).length) * 100);
        if (rate >= 50) {
            c4.className = 'si-icon pass'; c4.textContent = '✅';
            d4.textContent = `概念替换率 ${rate}%，良好`;
        } else {
            c4.className = 'si-icon fail'; c4.textContent = '⚠️';
            d4.textContent = `概念替换率 ${rate}%，建议提升`;
        }
        // 总体评分
        const badge = document.getElementById('scannerBadge');
        if (foundRisks === 0) {
            badge.className = 'scanner-badge pass'; badge.textContent = '✅ 全部通过';
        } else {
            badge.className = 'scanner-badge fail'; badge.textContent = `⚠️ ${foundRisks} 项待优化`;
        }
    }

    // ============================================================
    // 历史配方管理
    // ============================================================
    const historyList = [];
    function addToHistory() {
        if (!selectedTopic) return;
        const { stage, behavior, pain, strategy } = selectedTopic;
        const ratios = getSKURatios();
        const now = new Date();
        const timeStr = now.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        historyList.push({
            time: timeStr,
            stage: stage,
            behavior: behavior,
            pain: pain,
            strategy: strategy,
            ratio: `${ratios.pain}/${ratios.thrill}/${ratios.calm}`
        });
        document.getElementById('generatedCount').textContent = historyList.length;
        renderHistory();
    }
    function renderHistory() {
        const body = document.getElementById('historyBody');
        if (historyList.length === 0) {
            body.innerHTML = '<tr><td colspan="6" class="h-empty">暂无记录，生成选题后自动记录</td></tr>';
            return;
        }
        body.innerHTML = historyList.map(h => {
            // 截取短标签
            const shorten = (s, n) => s.length > n ? s.slice(0, n) + '..' : s;
            const stageShort = shorten(h.stage, 4);
            const behaviorShort = shorten(h.behavior, 6);
            const painShort = shorten(h.pain, 6);
            const strategyShort = shorten(h.strategy, 6);
            return `<tr>
                <td style="color:#94a3b8;font-size:10px;">${h.time}</td>
                <td><span class="h-tag stage-tag">${stageShort}</span></td>
                <td><span class="h-tag a-tag">${behaviorShort}</span></td>
                <td><span class="h-tag b-tag">${painShort}</span></td>
                <td><span class="h-tag c-tag">${strategyShort}</span></td>
                <td style="font-size:10px;color:#64748b;">${h.ratio}</td>
            </tr>`;
        }).join('');
    }
    window.clearHistory = function() {
        historyList.length = 0;
        document.getElementById('generatedCount').textContent = '0';
        renderHistory();
    };

    // 步骤条点击
    stepItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const step = index + 1;
            if (step <= currentStep + 1 && selectedTopic) {
                currentStep = step;
                updateStep(step);
            }
        });
    });

    // ============================================================
    // 左侧标签点击
    // ============================================================
    // 显示变量详情面板（子内容）
    function showDetail(dataArr, idx, detailId, cssClass) {
        const panel = document.getElementById(detailId);
        const item = dataArr[idx];
        if (!panel || !item) return;
        panel.className = 'detail-panel visible';
        panel.querySelector('.dp-label').textContent = item.label;
        panel.querySelector('.dp-label').style.color = cssClass === 'dp-a' ? '#e11d48' : cssClass === 'dp-b' ? '#b45309' : '#047857';
        panel.querySelector('.dp-desc').textContent = item.desc;
        const subsContainer = panel.querySelector('.dp-subs');
        subsContainer.innerHTML = item.subs.map(s => `<span class="${cssClass}">${s}</span>`).join('');
    }

    document.querySelectorAll('.stage-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.stage-pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            stageSelect.value = this.dataset.stage;
            updateFormulaPreview();
        });
    });

    document.querySelectorAll('.tag-pill.var-a').forEach(pill => {
        pill.addEventListener('click', function() {
            this.classList.toggle('active');
            const parent = this.parentElement;
            const active = parent.querySelectorAll('.active');
            if (active.length === 0) { this.classList.add('active'); return; }
            syncSelectFromSidebar();
            // 显示详情
            showDetail(behaviors, parseInt(this.dataset.idx), 'detailA', 'dp-a');
        });
    });

    document.querySelectorAll('.tag-pill.var-b').forEach(pill => {
        pill.addEventListener('click', function() {
            this.classList.toggle('active');
            const parent = this.parentElement;
            const active = parent.querySelectorAll('.active');
            if (active.length === 0) { this.classList.add('active'); return; }
            syncSelectFromSidebar();
            showDetail(painPoints, parseInt(this.dataset.idx), 'detailB', 'dp-b');
        });
    });

    document.querySelectorAll('.tag-pill.var-c').forEach(pill => {
        pill.addEventListener('click', function() {
            this.classList.toggle('active');
            const parent = this.parentElement;
            const active = parent.querySelectorAll('.active');
            if (active.length === 0) { this.classList.add('active'); return; }
            syncSelectFromSidebar();
            showDetail(strategies, parseInt(this.dataset.idx), 'detailC', 'dp-c');
        });
    });

    window.resetAllSelections = function() {
        // 恢复默认：A/B/C池各激活前3项
        ['behaviorPool', 'painPool', 'strategyPool'].forEach(poolId => {
            document.getElementById(poolId).querySelectorAll('.tag-pill').forEach((p, i) => {
                p.classList.toggle('active', i < 3);
            });
        });
        document.querySelectorAll('.stage-pill').forEach((p, i) => {
            p.classList.toggle('active', i === 0);
        });
        stageSelect.value = '0';
        syncSelectFromSidebar();
        // 隐藏所有详情面板
        document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('visible'));

        // 重置变量D（人性贪嗔痴，并入E）：清空选择
        document.querySelectorAll('#desireCatPool .tag-pill.var-d').forEach(t => t.classList.remove('active'));
        document.getElementById('ddSubs').innerHTML = '';
        selectedDesireCat = -1;
        userDesireChosen = false;
        document.getElementById('desireSummary').textContent = '👆 点击上方贪嗔痴标签，选择人性引擎';

        // 重置变量E（情绪SKU）为默认：止痛药（会自动推荐人性引擎）
        emotionSelect.value = 0;
        document.querySelectorAll('#emotionPool .tag-pill.var-e').forEach((p, i) => {
            p.classList.toggle('active', i === 0);
        });
        showEmotionDetail(0);

        // 重置诱饵产品为默认
        leadMagnetSelect.value = '0';

        // 重置变量G（内容类型）为默认：锚定诊断卡
        contentTypeSelect.value = '0';
        document.querySelectorAll('#contentTypePool .tag-pill.var-g').forEach((p, i) => {
            p.classList.toggle('active', i === 0);
        });
        showContentTypeDetail(0);

        updateFormulaPreview();
    };

    // ============================================================
    // 初始化：自动生成预设数据，页面不空载
    // ============================================================
    syncSelectFromSidebar();
    updateFormulaPreview();

    // 页面加载时自动生成一批选题
    const presetTopics = generateBatch();
    if (presetTopics.length > 0) {
        generatedTopics = presetTopics;
        renderGrid(presetTopics);
        selectTopic(0);
    } else {
        renderGrid([]);
        updateStep(1);
    }

})();
