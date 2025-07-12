# GitHub Workflow Operation Diagram

## 🔄 Workflow Execution Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Developer     │    │   GitHub        │    │   Workflow      │
│                 │    │   Repository    │    │   Runner        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Update VERSION     │                       │
         │    file               │                       │
         │──────────────────────▶│                       │
         │                       │                       │
         │ 2. git push           │                       │
         │──────────────────────▶│                       │
         │                       │                       │
         │                       │ 3. Detect VERSION     │
         │                       │    file change        │
         │                       │──────────────────────▶│
         │                       │                       │
         │                       │                       │ 4. Checkout
         │                       │                       │    repository
         │                       │                       │◀─────────────
         │                       │                       │
         │                       │                       │ 5. Read VERSION
         │                       │                       │    file
         │                       │                       │◀─────────────
         │                       │                       │
         │                       │                       │ 6. Update README
         │                       │                       │    badge
         │                       │                       │◀─────────────
         │                       │                       │
         │                       │                       │ 7. Commit &
         │                       │                       │    push changes
         │                       │◀──────────────────────│
         │                       │                       │
         │                       │ 8. Badge updated      │
         │                       │    in README          │
         │◀──────────────────────│                       │
```

## 📋 Step-by-Step Breakdown

### **Phase 1: Trigger**
1. **Developer Action**: You update the `VERSION` file
2. **Push**: You commit and push to GitHub
3. **Detection**: GitHub detects the `VERSION` file change

### **Phase 2: Workflow Execution**
4. **Checkout**: Workflow downloads your repository
5. **Read Version**: Extracts version number from `VERSION` file
6. **Update Badge**: Modifies README.md with new badge
7. **Commit**: Commits the changes back to your repository

### **Phase 3: Result**
8. **Updated**: README now shows the new version badge

## 🔧 Key Concepts

### **Triggers**
- **Path-based**: Only runs when specific files change
- **Branch-based**: Only runs on specific branches
- **Manual**: Can be triggered manually via GitHub UI

### **Environment**
- **Runner**: Ubuntu Linux virtual machine
- **Isolation**: Each workflow runs in its own environment
- **Clean State**: Fresh environment for each run

### **Data Flow**
- **Steps**: Sequential execution with shared data
- **Outputs**: Steps can pass data to other steps
- **Secrets**: Secure storage for sensitive data

### **Permissions**
- **GITHUB_TOKEN**: Built-in token for repository access
- **Scope**: Limited to the current repository
- **Auto-generated**: No manual setup required

## 🎯 Benefits

1. **Automation**: No manual badge updates needed
2. **Consistency**: Badge always matches VERSION file
3. **Reliability**: Runs on GitHub's infrastructure
4. **Visibility**: Clear execution logs in GitHub UI
5. **Security**: Uses GitHub's built-in security features

## 🔍 Monitoring

You can monitor workflow execution in:
- **Actions Tab**: See all workflow runs
- **Logs**: Detailed execution logs
- **Status**: Success/failure indicators
- **History**: Past workflow executions 