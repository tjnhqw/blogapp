/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreatePost = /* GraphQL */ `subscription OnCreatePost(
  $filter: ModelSubscriptionPostFilterInput
  $username: String
) {
  onCreatePost(filter: $filter, username: $username) {
    id
    title
    content
    username
    coverImage
    comments {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePostSubscriptionVariables,
  APITypes.OnCreatePostSubscription
>;
export const onUpdatePost = /* GraphQL */ `subscription OnUpdatePost(
  $filter: ModelSubscriptionPostFilterInput
  $username: String
) {
  onUpdatePost(filter: $filter, username: $username) {
    id
    title
    content
    username
    coverImage
    comments {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePostSubscriptionVariables,
  APITypes.OnUpdatePostSubscription
>;
export const onDeletePost = /* GraphQL */ `subscription OnDeletePost(
  $filter: ModelSubscriptionPostFilterInput
  $username: String
) {
  onDeletePost(filter: $filter, username: $username) {
    id
    title
    content
    username
    coverImage
    comments {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePostSubscriptionVariables,
  APITypes.OnDeletePostSubscription
>;
export const onCreateComment = /* GraphQL */ `subscription OnCreateComment(
  $filter: ModelSubscriptionCommentFilterInput
  $createdBy: String
) {
  onCreateComment(filter: $filter, createdBy: $createdBy) {
    id
    message
    post {
      id
      title
      content
      username
      coverImage
      createdAt
      updatedAt
      __typename
    }
    postID
    createdAt
    updatedAt
    createdBy
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCommentSubscriptionVariables,
  APITypes.OnCreateCommentSubscription
>;
export const onUpdateComment = /* GraphQL */ `subscription OnUpdateComment(
  $filter: ModelSubscriptionCommentFilterInput
  $createdBy: String
) {
  onUpdateComment(filter: $filter, createdBy: $createdBy) {
    id
    message
    post {
      id
      title
      content
      username
      coverImage
      createdAt
      updatedAt
      __typename
    }
    postID
    createdAt
    updatedAt
    createdBy
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCommentSubscriptionVariables,
  APITypes.OnUpdateCommentSubscription
>;
export const onDeleteComment = /* GraphQL */ `subscription OnDeleteComment(
  $filter: ModelSubscriptionCommentFilterInput
  $createdBy: String
) {
  onDeleteComment(filter: $filter, createdBy: $createdBy) {
    id
    message
    post {
      id
      title
      content
      username
      coverImage
      createdAt
      updatedAt
      __typename
    }
    postID
    createdAt
    updatedAt
    createdBy
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCommentSubscriptionVariables,
  APITypes.OnDeleteCommentSubscription
>;
