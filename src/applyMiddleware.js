import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
/**
 * 串联多个 middleware 改造成一个新的 dispatch
 */
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }
    let chain = []

    const middlewareAPI = {
      getState: store.getState,
      /**
       * 这里使用匿名函数的意义是使 middleware 中每次在调用 dispatch 的时候都重新获取一遍，
       * 因为下面会重新赋值 dispatch，这样做能保证 middleware 中始终是最新的
       */
      dispatch: (...args) => dispatch(...args)
    }
    /**
     * 将当前的 getState 和 dispatch 分发到每个 middleware 中执行一遍
     */
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    /**
     * 每个 middleware 处理一个相对独立的业务需求，返回一个经过包装的新的 dispatch 作为下一个 middleware 的参数
     * 这里把它们的处理结果串联起来，生成一个最终的新的 dispach
     */
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
