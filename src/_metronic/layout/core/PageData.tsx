/* eslint-disable @typescript-eslint/no-unused-vars */

import { FC, createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { WithChildren } from '../../helpers'
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    _data: Element | undefined;
  }
}

export interface PageLink {
}

export interface PageDataContextModel {
  getData: () => Element | undefined
  setData: (data: Element) => void
  loading: boolean
}

const PageDataContext = createContext<PageDataContextModel>({
  getData: () => undefined,
  setData: () => { },
  loading: true
})

const PageDataProvider: FC<WithChildren> = ({ children }) => {
  const [originalData, setOriginalData] = useState<{ [key: string]: Element | undefined }>({})
  const [firstMounted, setFirstMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const getData = () => {
    return originalData[window.location.pathname]
  }

  const setData = (data: Element) => {
    setOriginalData(prev => ({ ...prev, [window.location.pathname]: data }))
  }

  const value: PageDataContextModel = {
    setData,
    getData,
    loading,
  }

  useLayoutEffect(() => {
    console.log('LayoutProvider mounted')
    setOriginalData(prev => ({ ...prev, [window.location.pathname]: window._data }))
    setFirstMounted(true)
    setLoading(false)
  }, [])

  useLayoutEffect(() => {
    if (firstMounted) {
      console.log('LayoutProvider updated')
      setLoading(true)
      setOriginalData({})
      fetch(window.location.href)
        .then((response) => {
          if (response.status === 302) {
            window.location.href = '/Default.aspx'
          }
          return response.text()
        })
        .then((html) => {
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          if (doc) {
            const container = doc.querySelector('.container')
            if (container) {
              setOriginalData(prev => ({ ...prev, [window.location.pathname]: container }))
            }
          }
        }).catch((error) => {
          alert('Có lỗi xảy ra khi lấy dữ liệu từ máy chủ, vui lòng tải lại trang')
        }).finally(() => {
          setLoading(false)
        })
    } else {
      console.log('Not mounted yet')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  console.log('LayoutProvider rendered', originalData)

  return <PageDataContext.Provider value={value}>{children}</PageDataContext.Provider>
}

function usePageData() {
  return useContext(PageDataContext)
}

function usePageDataSelector(selector: { [key: string]: string }) {
  const { getData } = usePageData()

  const result: { [key: string]: string } = {}
  Object.keys(selector).forEach(key => {
    const value = selector[key]
    const selectedElement = getData()?.querySelector(value)
    result[key] = selectedElement instanceof HTMLElement ? selectedElement.innerText.trim() : ''
  })
  return result
}

function usePageDataCustom<T extends { [key: string]: (element: Element | undefined) => any }>(
  selector: T
): { [K in keyof T]: ReturnType<T[K]> } {
  const { getData } = usePageData()

  const result: any = {};
  Object.keys(selector).forEach(key => {
    result[key] = selector[key](getData()) ?? undefined;
  });

  return result;
}


export { PageDataProvider, usePageData, usePageDataSelector, usePageDataCustom }