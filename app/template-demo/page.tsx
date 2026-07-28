"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  cn,
  isEmail,
  isNotEmpty,
  formatDate,
  debounce,
  throttle,
  generateId,
  clamp,
  capitalize,
  sleep,
} from "@/lib/utils";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

export default function TemplateDemoPage() {
  const [savedName, setSavedName, clearSavedName] = useLocalStorage<string>(
    "demo-name",
    ""
  );
  const [savedCount, setSavedCount, clearSavedCount] = useLocalStorage<number>(
    "demo-count",
    0
  );

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const [toast, setToast] = useState("");

  const showToast = debounce((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }, 300);

  const throttledIncrement = throttle(() => {
    setSavedCount((c) => c + 1);
  }, 500);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !isEmail(value)) {
      setEmailError("请输入有效的邮箱地址");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!savedName) {
      showToast("请先输入姓名");
      return;
    }
    if (!isEmail(email)) {
      setEmailError("邮箱格式不正确");
      return;
    }
    setSubmittedData({ name: savedName, email });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            React + Next.js 14 基础模板
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            TypeScript · Tailwind CSS · App Router
          </p>
        </header>

        <Section
          title="Button 按钮组件"
          description="支持 primary / secondary / outline / ghost / destructive 五种变体和四种尺寸"
        >
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="icon">
              ★
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button loading>加载中</Button>
            <Button disabled>禁用</Button>
          </div>
        </Section>

        <Section
          title="Card 卡片组件"
          description="包含 Header / Title / Description / Content / Footer 子组件"
        >
          <Card>
            <CardHeader>
              <CardTitle>项目标题</CardTitle>
              <CardDescription>这是一个卡片的描述信息</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                卡片内容区域可以放置任何内容，包括文本、图片、表单等。
              </p>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost">取消</Button>
              <Button>确认</Button>
            </CardFooter>
          </Card>
        </Section>

        <Section
          title="Input 输入框组件"
          description="支持 label、error 状态，以及受控/非受控模式"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="姓名"
              placeholder="请输入你的名字"
              value={savedName}
              onChange={(e) => setSavedName(e.target.value)}
            />
            <Input
              label="邮箱"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              error={emailError}
            />
            <Button type="submit">提交</Button>
          </form>

          {submittedData && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-800 dark:text-green-200">
              提交成功！姓名：{submittedData.name}，邮箱：{submittedData.email}
            </div>
          )}
        </Section>

        <Section
          title="useLocalStorage Hook"
          description="数据持久化到 localStorage，跨组件/标签页共享"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                计数：{savedCount}
              </span>
              <Button size="sm" onClick={throttledIncrement}>
                +1 (节流 500ms)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSavedCount(0)}
              >
                重置
              </Button>
              <Button size="sm" variant="ghost" onClick={clearSavedCount}>
                清除
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              刷新页面后数据依然保留，存储键为 <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">demo-count</code>
            </p>
          </div>
        </Section>

        <Section
          title="工具函数演示"
          description="cn / isEmail / isNotEmpty / formatDate / debounce / throttle / generateId / clamp / capitalize / sleep"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                isEmail("test@test.com")
              </span>
              <p className="text-gray-500">{String(isEmail("test@test.com"))}</p>
            </div>
            <div className="space-y-1">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                isNotEmpty("hello")
              </span>
              <p className="text-gray-500">{String(isNotEmpty("hello"))}</p>
            </div>
            <div className="space-y-1">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                formatDate(new Date())
              </span>
              <p className="text-gray-500">{formatDate(new Date())}</p>
            </div>
            <div className="space-y-1">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                generateId("id-")
              </span>
              <p className="text-gray-500 break-all">{generateId("id-")}</p>
            </div>
            <div className="space-y-1">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                clamp(150, 0, 100)
              </span>
              <p className="text-gray-500">{clamp(150, 0, 100)}</p>
            </div>
            <div className="space-y-1">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                capitalize("hello world")
              </span>
              <p className="text-gray-500">{capitalize("hello world")}</p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={async () => {
                showToast("等待 1 秒完成");
                await sleep(1000);
                showToast("✅ sleep 完成");
              }}
            >
              测试 sleep / debounce
            </Button>
          </div>
        </Section>

        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-gray-900 text-white px-4 py-2 text-sm shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}